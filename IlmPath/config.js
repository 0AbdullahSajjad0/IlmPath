const config = {
  database: {
    user: "ilmpath_db_user",         // PostgreSQL username (from docker-compose.yml)
    host: "dpg-d16mikp5pdvs73fghpc0-a.oregon-postgres.render.com",       // Docker service name for the database
    database: "ilmpath_db", // PostgreSQL database name (from docker-compose.yml)
    password: "xOPa91SDLcUUO0FRElam0I6BFlVsTycG", // PostgreSQL password (from docker-compose.yml)
    port: 5432,             // PostgreSQL port (default)
  },
  apiBaseUrl: "http://192.168.100.142:5000", // API Base URL for the frontend
};

export default config;
