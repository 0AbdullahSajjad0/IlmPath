// Environment Validation
const requiredEnvVars = ["JWT_SECRET", "POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB"];
requiredEnvVars.forEach((env) => {
  if (!process.env[env]) {
    console.error(`Environment variable ${env} is missing.`);
  }
});

const { Pool } = require("pg");

// Database Pool Configuration
/*const pool = new Pool({
  user: process.env.POSTGRES_USER || "myuser",
  host: process.env.POSTGRES_HOST || "localhost",  // Use localhost for local dev
  database: process.env.POSTGRES_DB || "mydatabase",
  password: process.env.POSTGRES_PASSWORD || "mypassword",
  port: process.env.POSTGRES_PORT || 5432,
});*/

const pool = new Pool(
  process.env.DATABASE_URL            // ← preferred
  ? { connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } }   // Render requires SSL
  : {                                   // fallback to individual vars
      user: process.env.POSTGRES_USER || "myuser",
      host: process.env.POSTGRES_HOST || "localhost",
      database: process.env.POSTGRES_DB || "mydatabase",
      password: process.env.POSTGRES_PASSWORD || "mypassword",
      port: process.env.POSTGRES_PORT || 5432,
      ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : false
    }
);


(async () => {
  try {
    await pool.connect();
    console.log("✅  DB connection opened");

    const { rows } = await pool.query(`
      SELECT current_database() AS db,
             inet_server_addr() AS host_ip,
             inet_server_port() AS port ,
             version()          AS build
    `);
    console.table(rows); 

  } catch (err) {
    console.error("❌  DB connection failed:", err);
  }
})();

module.exports = pool;
