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

    inquirer.prompt([
        {
            type: "input",
            message: "What department do you want to add?",
            name: "addDepartment"
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name) 
        VALUES (?)`;
        db.query(sql, answer.addDepartment, (err, result) => {
            if(err) throw err;
            console.log("Added Department: " + answer.addDepartment);
            // console.table(answer);

            // db.end();
            showAllDepartments();
        })
    })

};



//function to add a Role
addRole = () => {

    inquirer.prompt([
        {
            type: "input",
            message: "What role do you want to add?",
            name: "addRoleTitle"
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "addRoleSalary"
        },
        {
            type: "input",
            message: "What is the department id for this role?",
            name: "addRoleId"
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO role (title, salary, department_id) 
        VALUES (?, ?, ?)`;
        const params = [answer.addRoleTitle, answer.addRoleSalary, answer.addRoleId]
        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log("Added Role: " + answer.addRoleTitle);
            // console.table(answer);

            // db.end();
            showAllRoles();
        })
    })

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
            addRole();
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
