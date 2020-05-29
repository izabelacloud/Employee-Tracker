const inquirer = require("inquirer");
const cTable = require('console.table');
const express = require('express');
const db = require('./db/database');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();


const departments = [];

// const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
// app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});


db.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId);
    afterConnection();
  });


afterConnection = () => {

    // console.log('Showing all departments...\n');
    // //query to select all departments
    // const sql = `SELECT * FROM department`;

    // //execute query
    // db.promise().query(sql, (err, rows) => {
    //     if(err) throw err;
    //     console.table(rows);
    // })
    promptInitialChoices()


        //end executing query
    // db.end();
};



//function to show all departments
showAllDepartments = () => {
    console.log('Showing all departments...\n');
    //query to select all departments
    const sql = `SELECT * FROM department`;

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
    })
        //end executing query
        db.end();
};



//function to show all roles
showAllRoles = () => {
    console.log('Showing all roles...\n');
    //query to select all departments
    const sql = `SELECT * FROM role`;

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
    })
        //end executing query
        db.end();
};


//function to show all employees
showAllEmployees = () => {
    console.log('Showing all employees...\n');
    //query to select all employees
    const sql = `SELECT * FROM employee`;

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
    })
        //end executing query
        db.end();
};


//function to add a Department
addDepartment = () => {
    console.log('Adding a department...\n');
    // sql = 'INSERT INTO department SET ?';
    // const params = [req.params.id];
    // const query = db.query(
    //   'INSERT INTO department SET ?',
    //   {
    //     name: 'test department name'
    //   },
    //   function(err, res) {
    //     if (err) throw err;
    //     console.log(res.affectedRows + ' department inserted!\n');
    //     // Call updateProduct() AFTER the INSERT completes
    //     // updateProduct();
    //   }
    // );
    // // logs the actual query being run
    // console.log(query.sql);

    const sql = `INSERT INTO department (name) 
    VALUES ('$departmentName')`;
    // const params = [departmentName];
    // ES5 function, not arrow function, to use `this`
    // db.query(sql, params, function(err, res) {
    //     if (err) throw err;
    //     console.log(res.affectedRows + ' department inserted!\n');

    // logs the actual query being run
    // console.log(query.sql);
    // });


    db.promise().query(sql, function(err, rows) {
        if(err) throw err;
        console.table(rows);
    })
        //end executing query
        db.end();
};




//function to initiate the first set of questions to the user
const promptInitialChoices = function() {
    inquirer.prompt([
        {
            type: "list",
            name: "initialChoices",
            message: "What would you like to do?",
            choices: [
                "View all departments", 
                "View all roles", 
                "View all employees", 
                "Add a department", 
                "Add a role", 
                "Add an employee", 
                "Update an employee role", 
                "Update employee manager",
                "View employees by manager",
                "View employees by department",
                "Delete departments",
                "Delete roles",
                "Delete employees",
                "View department budget"
            ],
            validate: choiceSelection => {
                if (choiceSelection) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ])
    .then((answers) => {
        const{initialChoices} = answers;

        if(initialChoices === "View all departments"){
            //call a function to show all departments
            showAllDepartments();
        }

        if(initialChoices === "View all roles"){
            //call a function to show all roles
            showAllRoles();
        }

        if(initialChoices === "View all employees"){
            //call a function to show all roles
            showAllEmployees();
        }

        if(initialChoices === "Add a department"){
            //call a function to show all roles
            addDepartment();
        }

        if(initialChoices === "Add a role"){
            //call a function to add a role
            // addRole();
        }

        if(initialChoices === "Add an employee"){
            //call a function to add an employee
            // addEmployee();
        }

        if(initialChoices === "Update an employee role"){

            // updateEmployeeRole();
        }

        if(initialChoices === "Update employee manager"){

            // updateEmployeeManager();
        }

        if(initialChoices === "View employees by manager"){

            // viewEmployeesByManager();
        }

        if(initialChoices === "View employees by department"){

            // viewEmployeesByDepartment();
        }

        if(initialChoices === "Delete departments"){

            // deleteDepartments();
        }

        if(initialChoices === "Delete roles"){

            // deleteRoles();
        }

        if(initialChoices === "Delete employees"){

            // deleteEmployees();
        }

        if(initialChoices === "View department budget"){

            // viewDepartmentBudget();
        }

    })
}




// promptInitialChoices();
// showAllDepartments();
