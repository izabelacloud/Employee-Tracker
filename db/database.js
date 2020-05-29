//importing mysql2
const mysql = require('mysql2');


// create the connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bogica17??',
    database: 'employees'
});


//exporting the module to the main server.js file
module.exports = db;