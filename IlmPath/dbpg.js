const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "nokia6600",
    database: "postgres"
});

client.connect();

client.query('SELECT * FROM users', (err, res) => {
    if (!err) {
        console.log(res.rows); // Use 'res.rows' to access the query results
    } else {
        console.log(err.message);
    }
    client.end(); // Call the end function to close the database connection
});
