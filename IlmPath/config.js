const config = {
  database: {
    user: "myuser",         // PostgreSQL username (from docker-compose.yml)
    host: "postgres",       // Docker service name for the database
    database: "mydatabase", // PostgreSQL database name (from docker-compose.yml)
    password: "mypassword", // PostgreSQL password (from docker-compose.yml)
    port: 5432,             // PostgreSQL port (default)
  },
  apiBaseUrl: "http://172.17.13.21:5000", // API Base URL for the frontend
};

export default config;
