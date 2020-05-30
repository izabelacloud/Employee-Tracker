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
    // afterConnection();
    promptInitialChoices();
});


// afterConnection = () => {

//     // console.log('Showing all departments...\n');
//     // //query to select all departments
//     // const sql = `SELECT * FROM department`;

//     // //execute query
//     // db.promise().query(sql, (err, rows) => {
//     //     if(err) throw err;
//     //     console.table(rows);
//     // })
//     promptInitialChoices()


//         //end executing query
//     // db.end();
// };



//function to show all departments
showAllDepartments = () => {
    console.log('Showing all departments...\n');
    //query to select all departments
    const sql = `SELECT * FROM department`;

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })
        //end executing query

        // db.end();
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

        promptInitialChoices();
    })
        //end executing query
        // db.end();
};


//function to show all employees
showAllEmployees = () => {
    console.log('Showing all employees...\n');
    //query to select all employees
    const sql = `SELECT first_name, last_name, role.title AS title, role.department_id AS department, role.salary AS salary, employee.manager_id AS manager  FROM employee 
                    JOIN role ON role.id = employee.role_id
                    JOIN department on department.id = role.department_id
                   `;

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })

    //end executing query
    // db.end();
};


//function to show all employees
// showOneEmployee = () => {
//     console.log('Showing employee...\n');
//     //query to select all employees
//     const sql = `SELECT * FROM employee WHERE name LIKE ?`;

//     //execute query
//     db.promise().query(sql, (err, rows) => {
//         if(err) throw err;
//         console.table(rows);
//     })
//         //end executing query
//         db.end();
// };


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
            promptInitialChoices();
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
            promptInitialChoices();
        })
    })

};


//function to choose a role
// chooseRole = () => {
//     inquirer.prompt([
//         {
//             type: "list",
//             message: "What is the role of the employee?",
//             name: "employeeAssignedRole"
//         }
//     ])
//     .then(answer => {
//         console.log(answer);
//     })
// }



//function to add a Employee
addEmployee = () => {

    inquirer.prompt([
        {
            type: "input",
            message: "What is the first name of the employee?",
            name: "addEmployeeFirstName"
        },
        {
            type: "input",
            message: "What is the last name of the employee?",
            name: "addEmployeeLastName"
        },
        // {
        //     type: "list",
        //     name: "employeeRole",
        //     message: "Please select from the list of roles: ",
        //     choices: `SELECT * FROM role`,
        // },
        {
            type: "input",
            message: "What is the employee role id?",
            name: "addEmployeeRoleId"
        },
        {
            type: "input",
            message: "What is the employee manager id?",
            name: "addEmployeeManagerId"
        }
    ])
    // .then(answer => {
    //      chooseRole();
    // })
    .then(answer => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?)`;
        const params = [answer.addEmployeeFirstName, answer.addEmployeeLastName, answer.addEmployeeRoleId, answer.addEmployeeManagerId]
        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log("Added Role: " + answer.addEmployeeFirstName + " " + answer.addEmployeeLastName);
            // console.table(answer);

            // db.end();
            showAllEmployees();
            promptInitialChoices();
        })
    })

};



//function to add a Employee
updateEmployeeRole = () => {

    inquirer.prompt([
        {
            type: "list",
            message: "Which employee's role would you like to update?",
            name: "updateEmployeeRole"
        }
    ])
    .then(answer => {
        const sql = `UPDATE employee SET role_id ? 
        VALUES (?, ?, ?, ?)`;
        const params = [answer.addEmployeeFirstName, answer.addEmployeeLastName, answer.addEmployeeRoleId, answer.addEmployeeManagerId]
        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log("Added Role: " + answer.addEmployeeFirstName + " " + answer.addEmployeeLastName);
            // console.table(answer);

            // db.end();
            showAllEmployees();
            promptInitialChoices();
        })
    })

};



viewEmployeesByManager = () => {
    console.log('Showing all employees by manager...\n');
    //query to show employees by manager

    const sql = `SELECT manager_id, CONCAT(first_name, " ", last_name) AS Name, 
                    COUNT(*)
                    FROM employee
                    WHERE manager_id = employee.id 
                    GROUP BY manager_id
                    ORDER BY manager_id ASC;`

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })

    //end executing query
    // db.end();

};





viewEmployeesByDepartment = () => {
    console.log('Showing all employees by department...\n');
    //query to show employees by department

    const sql = `SELECT COUNT(id), CONCAT(first_name, " ", last_name) AS Name 
    FROM  employee 
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    GROUP BY  department_id`;

    // const sql = `SELECT id, CONCAT(first_name, " ", last_name) AS Name, 
    //                 COUNT(*)
    //                 FROM employee
    //                 JOIN role ON role.id = employee.role_id
    //                 JOIN department ON role.department_id = department.id
    //                 WHERE role_id = role.id 
    //                 GROUP BY role_id
    //                 ORDER BY role_id ASC;`


    // const sql = `SELECT first_name, last_name, role.title AS title, role.department_id AS department, role.salary AS salary, employee.manager_id AS manager  FROM employee 
    // JOIN role ON role.id = employee.role_id
    // JOIN department on department.id = role.department_id
    // `;

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })

    //end executing query
    // db.end();

};


viewDepartmentBudget = () => {
    console.log('Showing all budget by department...\n');
    //query to show grouped salary by department id
    const sql = `SELECT department_id, department.name, SUM(salary) 
                    FROM  role 
                    JOIN department ON role.department_id = department.id
                    GROUP BY  department_id`;

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })

    //end executing query
    // db.end();

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
                "View department budget",
                "Finish program"
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
            addEmployee();
        }

        if(initialChoices === "Update an employee role"){

            // updateEmployeeRole();
        }

        if(initialChoices === "Update employee manager"){

            // updateEmployeeManager();
        }

        if(initialChoices === "View employees by manager"){

            viewEmployeesByManager();
        }

        if(initialChoices === "View employees by department"){

            viewEmployeesByDepartment();
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

            viewDepartmentBudget();
        }

        if(initialChoices === "Finish program"){

            //end executing query
            // db.end();
            return;
        }

    })
}



