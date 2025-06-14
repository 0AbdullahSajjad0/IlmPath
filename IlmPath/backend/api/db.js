// Environment Validation
const requiredEnvVars = ["JWT_SECRET", "POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB"];
requiredEnvVars.forEach((env) => {
  if (!process.env[env]) {
    console.error(`Environment variable ${env} is missing.`);
  }
});

const { Pool } = require("pg");

// Database Pool Configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER || "myuser",
  host: process.env.POSTGRES_HOST || "localhost",  // Use localhost for local dev
  database: process.env.POSTGRES_DB || "mydatabase",
  password: process.env.POSTGRES_PASSWORD || "mypassword",
  port: process.env.POSTGRES_PORT || 5432,
});

pool.connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Database connection failed:", err));

module.exports = pool;
