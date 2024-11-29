const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Pool
const pool = new Pool({
  user: "myuser",
  host: "postgres",
  database: "mydatabase",
  password: "mypassword",
  port: 5432,
});

// Sign Up Endpoint
app.post("/signup", async (req, res) => {
  const { email, password, role, name, nickName, dob, phoneNo, gender } = req.body;

  console.log("Received signup request:", req.body); // Debugging

  // Input validation
  if (!email || !password || !role || !name || !dob || !phoneNo || !gender) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the target table based on the role
    let targetTable;
    if (role === "student") {
      targetTable = "studentUser";
    } else if (role === "ullama") {
      targetTable = "UlamaUser";
    } else {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Insert the user into the appropriate table
    const result = await pool.query(
      `INSERT INTO "${targetTable}" (name, nickName, email, password, DOB, phoneNo, gender) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email`,
      [name, nickName, email, hashedPassword, dob, phoneNo, gender]
    );

    console.log("User inserted:", result.rows[0]);
    res.status(201).json({ message: "Sign Up Successful", user: result.rows[0] });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});




// Sign In Endpoint
// Sign In Endpoint
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Try finding the user in both tables
    let user = null;
    let role = null;

    // Search in studentUser table
    const studentResult = await pool.query('SELECT * FROM "studentUser" WHERE email = $1', [email]);
    if (studentResult.rows.length > 0) {
      user = studentResult.rows[0];
      role = "student";
    }

    // If not found in studentUser, search in UlamaUser table
    if (!user) {
      const ulamaResult = await pool.query('SELECT * FROM "UlamaUser" WHERE email = $1', [email]);
      if (ulamaResult.rows.length > 0) {
        user = ulamaResult.rows[0];
        role = "ullama";
      }
    }

    // If user is still not found, return an error
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role }, "JWT_SECRET", { expiresIn: "1h" });

    res.json({
      message: "Sign In Successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

