const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const Stripe = require('stripe');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const port = 5000;
const server = http.createServer(app);


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

const io = new Server(server, {
  cors: {
    origin: '*', // Use your frontend's URL in production
    methods: ['GET', 'POST']
  }
});

const activeTimers = {};

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  const rooms = {};
  const activeTimers = {};

  socket.on('joinRoom', async (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room ${chatId}`);
  
    // Track users in the room
    if (!rooms[chatId]) {
      rooms[chatId] = [];
    }
    if (!rooms[chatId].includes(socket.id)) {
      rooms[chatId].push(socket.id);
    }
  
    // When exactly 2 users are present, notify them
    if (rooms[chatId].length === 2) {
      io.to(chatId).emit('bothUsersJoined');
    }
  
    if (!activeTimers[chatId]) {
      try {
        // Fetch the appointment time from the database
        const result = await pool.query(
          `SELECT appointment_datetime FROM appointments WHERE chat_id = $1 AND status = false`,
          [chatId]
        );
  
        if (result.rows.length === 0) {
          console.log(`No active appointment found for chat ${chatId}.`);
          return;
        }
  
        const appointmentTime = new Date(result.rows[0].appointment_datetime);
        const endTime = new Date(appointmentTime.getTime() + 60 * 60 * 1000); // +1 hour
        const currentTime = new Date();
        const remainingTime = endTime - currentTime;
  
        if (remainingTime <= 0) {
          // Appointment already expired
          await pool.query(
            `UPDATE appointments SET status = true WHERE chat_id = $1`,
            [chatId]
          );
          io.to(chatId).emit('sessionEnded');
          console.log(`Session for chat ${chatId} already expired.`);
          return;
        }
  
        console.log(`Session for chat ${chatId} will end in ${Math.floor(remainingTime / 1000)} seconds.`);
  
        // Start the timer for the remaining time
        activeTimers[chatId] = setTimeout(async () => {
          try {
            await pool.query(
              `UPDATE appointments SET status = true WHERE chat_id = $1`,
              [chatId]
            );
            console.log(`⏰ Session for chat ${chatId} automatically ended after 1 hour from appointment time.`);
            io.to(chatId).emit('sessionEnded');
            delete activeTimers[chatId];
          } catch (error) {
            console.error("Error auto-ending session:", error);
          }
        }, remainingTime);
  
      } catch (error) {
        console.error("Error fetching appointment time:", error);
      }
    }
  });

  socket.on('sendMessage', ({ chatId, text, senderId, senderRole  }) => {
    console.log(`📩 Message in chat ${chatId} from user ${senderId}: ${text}`);
    io.to(chatId).emit('receiveMessage', { text, senderId, senderRole });
  });

  socket.on('endSession', async ({ chatId }) => {
    try {
      // Update appointment status to true (ended)
      await pool.query(
        `UPDATE appointments SET status = true WHERE chat_id = $1`,
        [chatId]
      );
  
      console.log(`Session for chat ${chatId} has ended.`);
  
      // Notify everyone in the room
      io.to(chatId).emit('sessionEnded');

      // Clear the timer if exists
      if (activeTimers[chatId]) {
        clearTimeout(activeTimers[chatId]);
        delete activeTimers[chatId];
      }
  
    } catch (error) {
      console.error("Error ending session:", error);
    }
  });
  

  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  
    // Remove socket from any rooms they were in
    for (const chatId in rooms) {
      rooms[chatId] = rooms[chatId].filter(id => id !== socket.id);
      if (rooms[chatId].length === 0) {
        delete rooms[chatId];
      }
    }
  });
});


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

app.post('/checkExistingAppointment', async (req, res) => {
  const { student_id, ulama_id } = req.body;

  if (!student_id || !ulama_id) {
    return res.status(400).json({ message: "Student ID and Ulama ID are required." });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM appointments 
       WHERE student_id = $1 AND ulama_id = $2 AND status = false`,
      [student_id, ulama_id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ exists: true, message: "An active appointment already exists." });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking existing appointment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


// Endpoint to book an appointment
app.post('/bookAppointment', async (req, res) => {
  try {
    const { student_id, ulama_id, appointment_date, appointment_time, appointment_details } = req.body;

    // Validate required fields
    if (!student_id || !ulama_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: "Missing required fields: student_id, ulama_id, appointment_date, and appointment_time." });
    }

    // Combine date and time into a single Date object (assumes appointment_date is in YYYY-MM-DD and appointment_time is in HH:mm:ss or HH:mm AM/PM format)
    // You may need to adjust parsing if the formats differ.
    const appointment_datetime = new Date(`${appointment_date}T${appointment_time}`);

    // Generate a unique chat id for the conversation room
    const chat_id = uuidv4();

    // Insert the appointment into the database
    const result = await pool.query(
      `INSERT INTO appointments (student_id, ulama_id, appointment_datetime, appointment_details, chat_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [student_id, ulama_id, appointment_datetime, appointment_details, chat_id]
    );

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Function to convert 24-hour time to 12-hour AM/PM format
const convertTo12HourFormat = (time24) => {
  if (!time24) return ""; // Handle empty cases

  let [hours, minutes] = time24.split(":").map(Number);
  const amPm = hours >= 12 ? "PM" : "AM";
  
  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12 || 12;

  // Ensure two-digit hour format (e.g., "03" instead of "3")
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${amPm}`;
};

app.get('/getAvailableTimes', async (req, res) => {
  const { ulama_id, appointment_date } = req.query;
  if (!ulama_id || !appointment_date) {
    return res.status(400).json({ message: "Ulama ID and date are required." });
  }

  try {
    console.log("Ulama ID:", ulama_id);
    console.log("Appointment Date (from frontend):", appointment_date);

    // Step 1: Fetch booked appointments for the given Ulama and date
    const result = await pool.query(
      `SELECT appointment_datetime FROM appointments 
       WHERE ulama_id = $1 
       AND appointment_datetime::DATE = $2::DATE
       AND status = false;`,  // Ensure only active bookings are checked
      [ulama_id, appointment_date]
    );

    console.log("Booked appointments retrieved successfully:", result.rows);

    // Step 2: Define all available slots in 12-hour format (same as UI)
    const allTimes = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
      '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    // Step 3: If there are no booked appointments, return all available times
    if (!result.rows || result.rows.length === 0) {
      console.log("No booked appointments found for this Ulama on this date. Returning all available times.");
      return res.status(200).json({ availableTimes: allTimes });
    }

    // Step 4: Convert booked times from 24-hour format to 12-hour AM/PM format
    const bookedTimes = result.rows.map(row =>
      convertTo12HourFormat(row.appointment_datetime.toTimeString().slice(0, 5))
    );

    console.log("Booked times (12-hour format):", bookedTimes);

    // Step 5: Filter out booked times from all available times
    const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
    console.log("Final Available times:", availableTimes);

    res.status(200).json({ availableTimes });
  } catch (error) {
    console.error("Error fetching available times:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// In your index.js (or routes file)
app.post('/getStudentAppointments', async (req, res) => {
  const { student_id } = req.body;
  console.log('/getStudentAppointments req.body:', req.body);
  if (!student_id) {
    return res.status(400).json({ message: "Student ID is required." });
  }
  try {
    // Join the appointments with the ulamauser table
    console.log("Fetching appointments for student:", student_id);
    const result = await pool.query(
      `SELECT a.*, u.name AS ulama_name, u.expertise, u.profileImage 
       FROM appointments a
       JOIN ulamauser u ON a.ulama_id = u.id
       WHERE a.student_id = $1 AND a.status = false`,
      [student_id]
    );
    console.log("Appointments retrieved successfully:", result.rows);
    res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments: result.rows
    });
    console.log("Appointments retrieved successfully:", result.rows);
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/getUlamaAppointments', async (req, res) => {
  const { ulama_id } = req.body;
  console.log('/getUlamaAppointments req.body:', req.body);

  if (!ulama_id) {
    return res.status(400).json({ message: "Ulama ID is required." });
  }

  try {
    console.log("Fetching appointments for ulama:", ulama_id);

    const result = await pool.query(
      `SELECT a.*, s.name AS student_name, s.profileImage AS student_profile_image 
       FROM appointments a
       JOIN studentuser s ON a.student_id = s.id
       WHERE a.ulama_id = $1 AND a.status = false`,
      [ulama_id]
    );

    console.log("Appointments retrieved successfully:", result.rows);

    res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments: result.rows
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check and end appointment if expired
app.post('/checkAndEndAppointment', async (req, res) => {
  const { appointment_id } = req.body;

  if (!appointment_id) {
    return res.status(400).json({ message: "Appointment ID is required." });
  }

  try {
    const result = await pool.query(
      `SELECT appointment_datetime, status FROM appointments WHERE id = $1`,
      [appointment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const appointment = result.rows[0];
    const appointmentTime = new Date(appointment.appointment_datetime);
    const currentTime = new Date();

    if (appointment.status) {
      return res.status(200).json({ expired: true, message: "Appointment has already ended." });
    }

    // ✅ Case 1: If current time is before appointment time
    if (currentTime < appointmentTime) {
      return res.status(200).json({
        expired: false,
        notStarted: true,
        message: `Appointment hasn't started yet. Please wait until ${appointmentTime.toLocaleString()}.`
      });
    }

    // ✅ Case 2: If current time is more than 1 hour after the appointment time
    const oneHourAfterAppointment = new Date(appointmentTime.getTime() + 60 * 60 * 1000);

    if (currentTime > oneHourAfterAppointment) {
      await pool.query(`UPDATE appointments SET status = true WHERE id = $1`, [appointment_id]);
      return res.status(200).json({ expired: true, message: "Appointment time exceeded by over an hour. Status updated." });
    }

    return res.status(200).json({ expired: false, message: "Appointment is still active." });
  } catch (error) {
    console.error("Error checking appointment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


app.post('/endAppointment', async (req, res) => {
  const { appointment_id } = req.body;
  try {
    await pool.query(
      'UPDATE appointments SET status = true WHERE id = $1',
      [appointment_id]
    );
    res.status(200).json({ message: 'Appointment ended successfully.' });
  } catch (error) {
    console.error('Error ending appointment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.post("/toggleBookmark", async (req, res) => {
  const { user_id, user_role, bookmarked_surah, bookmarked_ayah } = req.body;

  if (!user_id || !user_role || !bookmarked_surah || !bookmarked_ayah) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the bookmark already exists
    const existingBookmark = await pool.query(
      "SELECT id FROM bookmarks WHERE user_id = $1 AND user_role = $2 AND bookmarked_surah = $3 AND bookmarked_ayah = $4",
      [user_id, user_role, bookmarked_surah, bookmarked_ayah]
    );

    if (existingBookmark.rows.length > 0) {
      // If exists, remove the bookmark
      await pool.query("DELETE FROM bookmarks WHERE id = $1", [existingBookmark.rows[0].id]);
      return res.status(200).json({ message: "Bookmark removed successfully", bookmarked: false });
    } else {
      // Otherwise, add a new bookmark
      await pool.query(
        "INSERT INTO bookmarks (user_id, user_role, bookmarked_surah, bookmarked_ayah) VALUES ($1, $2, $3, $4)",
        [user_id, user_role, bookmarked_surah, bookmarked_ayah]
      );
      return res.status(201).json({ message: "Bookmark added successfully", bookmarked: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/getBookmarks", async (req, res) => {
  const { user_id, user_role } = req.body;

  if (!user_id || !user_role) {
    return res.status(400).json({ message: "User ID and role are required." });
  }

  try {
    const result = await pool.query(
      "SELECT bookmarked_surah, bookmarked_ayah FROM bookmarks WHERE user_id = $1 AND user_role = $2",
      [user_id, user_role]
    );

    return res.status(200).json({
      message: "Bookmarks retrieved successfully",
      bookmarks: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving bookmarks:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});




// Start the server
try {
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server with Socket.io is running on port ${port}`);
  });  
} catch (error) {
  console.error("Error starting the server:", error);
}
