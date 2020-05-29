const inquirer = require("inquirer");
const cTable = require('console.table');
const express = require('express');
const db = require('./db/database');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});




// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Bogica17??',
//   database: './db/election.db'
// });
// db.connect((err) => {
//   if (err) throw err;
//   console.log('Connected!');
// });