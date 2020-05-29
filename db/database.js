//importing mysql2
const mysql = require('mysql2');
require('dotenv').config();


// create the connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'employees'
});


//exporting the module to the main server.js file
module.exports = db;