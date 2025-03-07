const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const Stripe = require('stripe');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debugging Server Startup
console.log("Starting the application...");

// Environment Validation
const requiredEnvVars = ["JWT_SECRET", "POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB"];
requiredEnvVars.forEach((env) => {
  if (!process.env[env]) {
    console.error(`Environment variable ${env} is missing.`);
  }
});

// Database Pool
let pool;
try {
  pool = new Pool({
    user: process.env.POSTGRES_USER || "myuser",
    host: process.env.POSTGRES_HOST || "postgres",
    database: process.env.POSTGRES_DB || "mydatabase",
    password: process.env.POSTGRES_PASSWORD || "mypassword",
    port: process.env.POSTGRES_PORT || 5432,
  });
  console.log("Database connection initialized.");
} catch (err) {
  console.error("Error initializing database connection:", err);
}



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Path inside the container
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const stripe = Stripe('sk_test_51QUaXvLPk2ToxWUBhHD5Z3hZRdTgeAlJJFKqo6iDbI8Z9CLDz0xZSwRHLL9TD4SSwR39PcxAxlGybR93CNTzr3qL00UfoCnG1t');

// Test Database Connectivity
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected:", res.rows[0]);
  }
});

// Sign-Up Endpoint
app.post("/signup", upload.fields([{ name: "profileImage" }, { name: "certificateImage" }]), async (req, res) => {
  try {
    const { email, password, role, name, nickName, dob, phoneNo, gender, expertise } = req.body;

    // Log the request body and files
    console.log("Received signup request:", req.body);
    console.log("Uploaded files:", req.files);

    // Extract uploaded file paths
    const profileImage = req.files?.profileImage?.[0]?.path || null;
    const certificateImage = req.files?.certificateImage?.[0]?.path || null;
    console.log('Ullama Data:', certificateImage);
    // Input validation
    if (!email || !password || !role || !name || !dob || !phoneNo || !gender) {
      console.warn("Sign-up validation failed: Missing fields.");
      return res.status(400).json({ message: "All fields are required." });
    }

    // Additional validation for role-specific fields
    if (role === "ullama" && (!expertise || !certificateImage)) {
      console.warn("Sign-up validation failed: Missing expertise or certificate image for Ullama.");
      return res.status(400).json({ message: "Expertise and certificate image are required for Ullama." });
    }
    if (role === "student" && !nickName) {
      console.warn("Sign-up validation failed: Missing nickName for Student.");
      return res.status(400).json({ message: "Nick Name is required for Student." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare SQL query and values based on role
    let targetTable, insertFields, insertValues, placeholders;

    if (role === "student") {
      targetTable = "studentuser";
      insertFields = "(name, nickName, email, password, DOB, phoneNo, gender)"; //, profileImage)";
      insertValues = [name, nickName, email, hashedPassword, dob, phoneNo, gender]; //, profileImage];
      placeholders = "$1, $2, $3, $4, $5, $6, $7";                //, $8"; // 8 placeholders
    } else if (role === "ullama") {
      targetTable = "ulamauser";
      insertFields = "(name, expertise, email, password, DOB, phoneNo, gender, certificateImage)";
      insertValues = [name, expertise, email, hashedPassword, dob, phoneNo, gender, certificateImage];
      placeholders = "$1, $2, $3, $4, $5, $6, $7, $8"; // 9 placeholders if add profileImage
    } else {
      console.warn("Invalid role specified:", role);
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Insert the user into the appropriate table
    const result = await pool.query(
      `INSERT INTO "${targetTable}" ${insertFields} 
       VALUES (${placeholders}) RETURNING *`,
      insertValues
    );
    // Add the role to the response object
    const user = { ...result.rows[0], role };

    console.log("User inserted successfully:", user);
    res.status(201).json({ message: "Sign Up Successful", user });
    
    } catch (error) {
      console.error("Error during sign up:", error);

      // Handle unique constraint violation
      if (error.code === "23505") {
        return res.status(409).json({ message: "Email already registered in the system." });
      }

      res.status(500).json({ message: "Internal server error." });
    }
});



// Sign In Endpoint
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Received signin request:", req.body);

    // Input validation
    if (!email || !password) {
      console.warn("Sign-in validation failed: Missing email or password.");
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Search for the user in both tables
    let user = null;
    let role = null;

    const studentResult = await pool.query("SELECT * FROM studentuser WHERE email = $1", [email]);
    if (studentResult.rows.length > 0) {
      user = studentResult.rows[0];
      role = "student";
    }

    if (!user) {
      const ulamaResult = await pool.query("SELECT * FROM ulamauser WHERE email = $1", [email]);
      if (ulamaResult.rows.length > 0) {
        user = ulamaResult.rows[0];
        role = "ullama";
      }
    }

    if (!user) {
      console.warn("Sign-in failed: User not found.");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn("Sign-in failed: Incorrect password.");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role }, process.env.JWT_SECRET || "JWT_SECRET", {
      expiresIn: "1h",
    });

    console.log("Sign-in successful for user:", user.email);
    res.json({
      message: "Sign In Successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role,
        name: user.name,
        phoneNo: user.phoneno,
        gender: user.gender,
        profileImage: user.profileimage,
      },
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Track Progress Endpoint
// Track Progress Endpoint
app.post("/trackProgress", async (req, res) => {
  const { user_id, role } = req.body;

  // Input validation
  if (!user_id || !role) {
    return res.status(400).json({ message: "User ID and role are required." });
  }

  try {
    // Validate role
    if (role !== "student" && role !== "ullama") {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Check if the user already exists in the progress table
    const existingProgress = await pool.query(
      "SELECT progress FROM progress WHERE user_id = $1 AND user_role = $2",
      [user_id, role]
    );

    if (existingProgress.rows.length > 0) {
      // User exists, calculate the new progress
      const currentProgress = existingProgress.rows[0].progress;
      const newProgress = currentProgress === 6235 ? 0 : currentProgress + 1;

      await pool.query(
        "UPDATE progress SET progress = $1 WHERE user_id = $2 AND user_role = $3",
        [newProgress, user_id, role]
      );

      return res.status(200).json({
        message: "Progress updated successfully.",
        progress: newProgress,
      });
    } else {
      // User does not exist in progress, create a new progress record
      await pool.query(
        "INSERT INTO progress (user_id, progress, user_role) VALUES ($1, $2, $3)",
        [user_id, 1, role]
      );

      return res.status(201).json({
        message: "Progress created successfully.",
        progress: 1,
      });
    }
  } catch (error) {
    console.error("Error tracking progress:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Get Progress Endpoint
app.post("/getProgress", async (req, res) => {
  const { user_id, role } = req.body;

  // Input validation
  if (!user_id || !role) {
    return res.status(400).json({ message: "User ID and role are required." });
  }

  try {
    // Validate role
    if (role !== "student" && role !== "ullama") {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Fetch the progress from the database
    const progressResult = await pool.query(
      "SELECT progress FROM progress WHERE user_id = $1 AND user_role = $2",
      [user_id, role]
    );

    if (progressResult.rows.length > 0) {
      // Progress found
      return res.status(200).json({
        id: user_id,
        role: role,
        progress: progressResult.rows[0].progress,
      });
    } else {
      // No progress found for the user
      return res.status(404).json({ message: "No progress found for this user." });
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/saveNote", async (req, res) => {
  const { user_id, user_role, note_text, note_surrah, note_ayah } = req.body;

  // Input validation
  if (!user_id || !user_role || !note_text || !note_surrah || !note_ayah) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Validate user_role
    if (user_role !== "student" && user_role !== "ullama") {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Check if a note already exists for the specific user, role, Surah, and Ayah
    const existingNote = await pool.query(
      `SELECT id FROM notes WHERE user_id = $1 AND user_role = $2 AND note_surrah = $3 AND note_ayah = $4`,
      [user_id, user_role, note_surrah, note_ayah]
    );

    if (existingNote.rows.length > 0) {
      // If a note exists, update the existing row
      const updateResult = await pool.query(
        `UPDATE notes 
         SET note_text = $1 
         WHERE id = $2 
         RETURNING id`,
        [note_text, existingNote.rows[0].id]
      );

      console.log("Note updated successfully:", updateResult.rows[0]);
      return res.status(200).json({ message: "Note updated successfully", noteId: updateResult.rows[0].id });
    } else {
      // If no note exists, insert a new row
      const insertResult = await pool.query(
        `INSERT INTO notes (user_id, user_role, note_text, note_surrah, note_ayah)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [user_id, user_role, note_text, note_surrah, note_ayah]
      );

      console.log("Note added successfully:", insertResult.rows[0]);
      return res.status(201).json({ message: "Note added successfully", noteId: insertResult.rows[0].id });
    }
  } catch (error) {
    console.error("Error adding/updating note:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Retrieve Note Endpoint
app.post("/getNote", async (req, res) => {
  const { user_id, user_role, note_surrah, note_ayah } = req.body;

  // Input validation
  if (!user_id || !user_role || !note_surrah || !note_ayah) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Validate user_role
    if (user_role !== "student" && user_role !== "ullama") {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Query to retrieve the note
    const noteResult = await pool.query(
      `SELECT note_text 
       FROM notes 
       WHERE user_id = $1 AND user_role = $2 AND note_surrah = $3 AND note_ayah = $4`,
      [user_id, user_role, note_surrah, note_ayah]
    );

    if (noteResult.rows.length > 0) {
      // Note found
      console.log("Note retrieved successfully:", noteResult.rows[0]);
      return res.status(200).json({
        message: "Note retrieved successfully",
        note: noteResult.rows[0].note_text,
      });
    } else {
      // Note not found
      return res.status(404).json({ message: "Note not found." });
    }
  } catch (error) {
    console.error("Error retrieving note:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Retrieve User Details Endpoint
app.post("/getUserDetails", async (req, res) => {
  const { user_id, user_role } = req.body;

  // Input validation
  if (!user_id || !user_role) {
    return res.status(400).json({ message: "User ID and role are required." });
  }

  try {
    // Validate user_role
    if (user_role !== "student" && user_role !== "ullama") {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Determine the target table based on the user role
    const targetTable = user_role === "student" ? "studentuser" : "ulamauser";

    // Query to retrieve user details
    const userResult = await pool.query(
      `SELECT name, email, profileImage 
       FROM ${targetTable} 
       WHERE id = $1`,
      [user_id]
    );

    if (userResult.rows.length > 0) {
      // User found
      console.log("User details retrieved successfully:", userResult.rows[0]);
      return res.status(200).json({
        message: "User details retrieved successfully",
        user: userResult.rows[0],
      });
    } else {
      // User not found
      return res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get All Ulama List Endpoint
app.get("/getAllUlama", async (req, res) => {
  try {
    // Query to fetch all Ulama information
    const ulamaList = await pool.query(
      `SELECT id, name, expertise, email, DOB, phoneNo, gender, certificateImage, profileImage, verified 
       FROM ulamauser 
       WHERE verified = true`
    );

    if (ulamaList.rows.length > 0) {
      // Return the list of Ulama
      console.log("Ulama list retrieved successfully:", ulamaList.rows);
      return res.status(200).json({
        message: "Ulama list retrieved successfully",
        ulama: ulamaList.rows,
      });
    } else {
      // No Ulama found
      return res.status(404).json({ message: "No Ulama found in the database." });
    }
  } catch (error) {
    console.error("Error retrieving Ulama list:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in cents (e.g., $10 = 1000)

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// endpoint to proxy audio search requests
app.post("/audio-search-proxy", upload.single("audio"), async (req, res) => {
  try {
    // Ensure that an audio file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No audio file provided." });
    }

    // Create a FormData object and append the audio file.
    const formData = new FormData();
    formData.append("audio", fs.createReadStream(req.file.path), req.file.originalname);

    console.log("Forwarding audio file to Python service...");

    // Send a POST request to the Python service.
    // Note: Use the Docker Compose service name "python-service" (as defined in docker-compose.yaml)
    const response = await axios.post("http://python-service:8000/audio-search", formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Optionally, delete the temporary uploaded file after forwarding
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("Uploaded file deleted successfully.");
    });

    // Return the response received from the Python service back to the client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in /audio-search-proxy:", error);
    return res.status(500).json({ message: "Internal server error", details: error.message });
  }
});

// Chatbot proxy endpoint
app.post("/chatbot-proxy", async (req, res) => {
  try {
    // Ensure that the query is provided
    if (!req.body || !req.body.query) {
      return res.status(400).json({ message: "Query is required." });
    }

    console.log("Forwarding chatbot query to Python service...");

    // Forward the JSON payload to the Python service's /chatbot endpoint
    const response = await axios.post("http://python-service:8000/chatbot", req.body, {
      headers: { "Content-Type": "application/json" }
    });

    // Return the response from the Python service back to the client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in /chatbot-proxy:", error);
    return res.status(500).json({ message: "Internal server error", details: error.message });
  }
});

// Proxy endpoint for Tajweed detection
app.post("/tajweed-proxy", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file provided." });
    }
    const formData = new FormData();
    formData.append("audio", fs.createReadStream(req.file.path), req.file.originalname);
    console.log("Forwarding audio file to Python /tajweed endpoint...");
    const response = await axios.post("http://python-service:8000/tajweed", formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("Uploaded file deleted successfully.");
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in /tajweed-proxy:", error);
    return res.status(500).json({ message: "Internal server error", details: error.message });
  }
});




// Start the server
try {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
