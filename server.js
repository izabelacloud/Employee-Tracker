const inquirer = require("inquirer");
const cTable = require('console.table');
const express = require('express');
const db = require('./db/database');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});


db.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId);
    //call function to prompt for initial choices
    promptInitialChoices();

});





//********* MAIN FUNCTIONS **************//


//function to show all departments
showAllDepartments = () => {
    console.log('Showing all departments...\n');
    //query to select all departments
    const sql = `SELECT * FROM department ORDER BY name ASC`;

    //execute query
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();

    })

};



//function to show all roles
showAllRoles = () => {
    console.log('Showing all roles...\n');
    //query to select all departments
    const sql = `SELECT * FROM role ORDER BY title ASC`;
    const sql2 = `SELECT role.title, role.salary, role.id, department.name AS department FROM role
                    LEFT JOIN department ON role.department_id = department.id
                    ORDER BY title ASC`;

    //execute query
    db.promise().query(sql2, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })

};


//function to show all employees
showAllEmployees = () => {
    console.log('Showing all employees...\n');
    //query to select all employees
    const sql2 =    `SELECT e.id, 
                        e.first_name, 
                        e.last_name, 
                        role.title, 
                        department.name AS department, 
                        role.salary, 
                        CONCAT(emp_manager.first_name, " ",  emp_manager.last_name) AS manager 

                    FROM employee e 
                        LEFT JOIN employee emp_manager ON e.manager_id = emp_manager.id 
                        LEFT JOIN role ON e.role_id = role.id 
                        LEFT JOIN department ON role.department_id = department.id`

    //execute query
    db.promise().query(sql2, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })

};



//function to add a Department
addDepartment = () => {

    inquirer.prompt([
        {
            type: "input",
            message: "What department do you want to add?",
            name: "addNewDepartment",
            validate: departmentNameInput => {
                if(departmentNameInput.match("[a-zA-Z]+$")) {
                    return true;
                } else {
                    console.log("Please enter the Department name as a string!");
                    return false;
                }
            }

        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name) 
        VALUES (?)`;
        db.query(sql, answer.addNewDepartment, (err, result) => {
            if(err) throw err;
            console.log("Added Department: " + answer.addNewDepartment);

            //calling new functions
            showAllDepartments();
            
        })
    })

};



//function to add a Role
addRole = () => {

    //query to get the departments
    const departmentsQueryforRole = `SELECT name, id FROM department`;


    db.query(departmentsQueryforRole, (err, allAddedNewDepartments) => {
        if(err) throw err;

        const departmentChoicesForRole = allAddedNewDepartments.map(dept => {
            const departmentChoiceForRole = {name: dept.name, value: dept.id};
            return departmentChoiceForRole;
        })

        inquirer.prompt([
            {
                type: "input",
                message: "What role do you want to add?",
                name: "addRoleTitleNew",
                validate: roleTitleInput => {
                    if(roleTitleInput.match("[a-zA-Z]+$")) {
                        return true;
                    } else {
                        console.log("Please enter the Title name as a string!");
                        return false;
                    }
                }
            },
            {
                type: "input",
                message: "What is the salary for this role?",
                name: "addRoleSalaryNew",
                validate: salaryInput => {
                    if(salaryInput.match("[0-9]+$")) {
                        return true;
                    } else {
                        console.log("Please enter the Salary as a number!");
                        return false;
                    }
                }
            },
            {
                type: "list",
                message: "What is the department of this role?",
                name: "addRoleIdNew",
                choices: departmentChoicesForRole
            }
        ])
        .then(answer => {
            const sql = `INSERT INTO role (title, salary, department_id) 
            VALUES (?, ?, ?)`;

            
            const params = [answer.addRoleTitleNew, answer.addRoleSalaryNew, answer.addRoleIdNew]
            db.query(sql, params, (err, result) => {
                if(err) throw err;
                console.log("Added Role: " + answer.addRoleTitle);

                showAllRoles();
          
            })
        })
    })
};




//function to add a Employee
addEmployee = () => {

    const managerQueryForAddEmployee =   `SELECT 
                                                empl.manager_id, 
                                                empl.first_name, 
                                                empl.last_name, 
                                                mgr.first_name, 
                                                mgr.last_name, 
                                                mgr.id
                                            FROM employee mgr
                                            LEFT JOIN employee empl ON empl.manager_id = mgr.id 
                                            WHERE empl.manager_id is not null;`

    const rolesForAddEmployee = `SELECT id, title, salary, department_id FROM role`;

    db.query(rolesForAddEmployee, (err, allRoles) => {
        if(err) throw err;


        db.query(managerQueryForAddEmployee, (err, allManagers) => {
            if(err) throw err;

            const roleChoices = allRoles.map(role => {
                const roleChoice = {name: role.title, value: role.id};
                return roleChoice;
            })


            const managerChoices = allManagers.map(mgr => {
                const managerChoice = {name: mgr.first_name + " " + mgr.last_name , value: mgr.id};
                return managerChoice;
            })


            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the first name of the employee?",
                    name: "addEmployeeFirstNameNew",
                    validate: firstNameInput => {
                        if(firstNameInput.match("[a-zA-Z]+$")) {
                            return true;
                        } else {
                            console.log("Please enter the First name as a string!");
                            return false;
                        }
                    }
                },
                {
                    type: "input",
                    message: "What is the last name of the employee?",
                    name: "addEmployeeLastNameNew",
                    validate: lastNameInput => {
                        if(lastNameInput.match("[a-zA-Z]+$")) {
                            return true;
                        } else {
                            console.log("Please enter the Last name as a string!");
                            return false;
                        }
                    }
                },
                {
                    type: "list",
                    message: "Select from the list of roles ",
                    name: "addEmployeeRoleIdNew",
                    choices: roleChoices
                },
                {
                    type: "list",
                    message: "Select from the list of managers ",
                    name: "addEmployeeManagerIdNew",
                    choices: managerChoices
                }
            ])
            .then(answer => {
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                VALUES (?, ?, ?, ?)`;
                const params = [answer.addEmployeeFirstNameNew, answer.addEmployeeLastNameNew, answer.addEmployeeRoleIdNew, answer.addEmployeeManagerIdNew]
                db.query(sql, params, (err, result) => {
                    if(err) throw err;
                    console.log("Added Role: " + answer.addEmployeeFirstName + " " + answer.addEmployeeLastName);
       

                    showAllEmployees();
               
                })
            })

        })

    })

};



//function to update an Employee Role
updateEmployeeRole = () => {

    const employeesNew = `SELECT * FROM employee`;
    const rolesNew = `SELECT * FROM role`;


    db.query(employeesNew, (err, allEmployeesForUpdate) => {
        if(err) throw err;


        db.query(rolesNew, (err, allEmployeeRolesForUpdate) => {
            if(err) throw err;


            const employeeChoicesForUpdate = allEmployeesForUpdate.map(employee => {
                const employeeChoiceForUpdate = {name: (employee.first_name + " " + employee.last_name) , value: employee.id};
                return employeeChoiceForUpdate;
            })

            const roleChoicesForUpdate = allEmployeeRolesForUpdate.map(role => {
                const roleChoiceForUpdate = {name: role.title, value: role.id};
                return roleChoiceForUpdate;
            })



            inquirer.prompt([
                {
                    type: "list",
                    message: "Select from the list of employees ",
                    name: "employeeListForUpdate",
                    choices: employeeChoicesForUpdate
                },
                {
                    type: "list",
                    message: "Select from the list of roles ",
                    name: "employeeRoleListForUpdate",
                    choices: roleChoicesForUpdate
                }
            ])
            .then(answer => {
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                const params = [answer.employeeRoleListForUpdate, answer.employeeListForUpdate]
                db.query(sql, params, (err, result) => {
                    if(err) throw err;
                    console.log("Updated Employee: " + answer.employeeListForUpdate + "and set Role to: " + answer.employeeRoleListForUpdate);
            
         
                    showAllEmployees();
           
                })
            })

        })

    })

};





//function to update an Employee Manager
updateEmployeeManager = () => {

    const employeesNewForManagerUpdate = `SELECT * FROM employee`;

    const managerQueryNew =   `SELECT 
                                    empl.manager_id, 
                                    empl.first_name, 
                                    empl.last_name, 
                                    man.first_name, 
                                    man.last_name, 
                                    man.id
                                FROM employee man
                                LEFT JOIN employee empl ON empl.manager_id = man.id 
                                WHERE empl.manager_id is not null;`


    db.query(employeesNewForManagerUpdate, (err, allEmployeesForManagerUpdate) => {
        if(err) throw err;


        db.query(managerQueryNew, (err, allManagersForManagerUpdate) => {
            if(err) throw err;


            const employeeChoicesForManagerUpdate = allEmployeesForManagerUpdate.map(employee => {
                const employeeChoiceForManagerUpdate = {name: (employee.first_name + " " + employee.last_name) , value: employee.id};
                return employeeChoiceForManagerUpdate;
            })

            const managerChoicesForManagerUpdate = allManagersForManagerUpdate.map(man => {
                const managerChoiceForManagerUpdate = {name: man.first_name + " " + man.last_name , value: man.id};
                return managerChoiceForManagerUpdate;
            })



            inquirer.prompt([
                {
                    type: "list",
                    message: "Select from the list of employees ",
                    name: "employeeListForManagerUpdate",
                    choices: employeeChoicesForManagerUpdate
                },
                {
                    type: "list",
                    message: "Select from the list of managers ",
                    name: "managerListForManagerUpdate",
                    choices: managerChoicesForManagerUpdate
                }
            ])
            .then(answer => {
                const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
                const params = [answer.managerListForManagerUpdate, answer.employeeListForManagerUpdate]
                db.query(sql, params, (err, result) => {
                    if(err) throw err;
                    console.log("Updated Employee: " + answer.employeeListForManagerUpdate + "and set Manager to: " + answer.managerListForManagerUpdate);
                    

                    showAllEmployees();
            
                })
            })

        })

    })

};



//function to view employees by manager
viewEmployeesByManager = () => {
    console.log('Showing all employees by manager...\n');
    //query to show employees by manager

    sql = `SELECT 
                empl.manager_id,
                man.first_name,
                man.last_name,
                COUNT(*) 
            FROM employee empl, employee man
            WHERE empl.manager_id = man.id
            GROUP BY empl.manager_id
            ORDER BY empl.manager_id ASC;`

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })

};





viewEmployeesByDepartment = () => {
    console.log('Showing all employees by department...\n');
    //query to show employees by department

    const sql = `SELECT department.name, COUNT(employee.id) 
                    FROM  employee 
                    JOIN role ON employee.role_id = role.id
                    JOIN department ON role.department_id = department.id
                    GROUP BY  department_id`;

    //execute query
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })

};


//function to view department budget
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

};



//function to delete a Department
deleteDepartments = () => {

    const departmentList = `SELECT * FROM department`;

    db.query(departmentList, (err, allDepartments) => {
        if(err) throw err;

        const departmentChoices = allDepartments.map(department => {
            const departmentChoice = {name: department.name, value: department.id};
            return departmentChoice;
        })

        inquirer.prompt([
            {
                type: "list",
                message: "What department do you want to delete?",
                name: "departmentName",
                choices: departmentChoices
            }
        ])
        .then(answer => {
            const sql = `DELETE FROM department WHERE id = ?`;
            const params = [answer.departmentName]
            db.query(sql, params, (err, result) => {
                if(err) throw err;
                console.log("Deleted Department: " + answer.departmentName);

                showAllDepartments();
             
            })
        })
    })
};





//function to delete a Role
deleteRoles = () => {

    const roleList = `SELECT * FROM role`;

    db.query(roleList, (err, allRolesForDelete) => {
        if(err) throw err;

        const roleChoicesForDelete = allRolesForDelete.map(role => {
            const roleChoiceForDelete = {name: role.title, value: role.id};
            return roleChoiceForDelete;
        })

        inquirer.prompt([
            {
                type: "list",
                message: "What role do you want to delete?",
                name: "roleNameForDelete",
                choices: roleChoicesForDelete
            }
        ])
        .then(answer => {
            const sql = `DELETE FROM role WHERE id = ?`;
            const params = [answer.roleNameForDelete]
            db.query(sql, params, (err, result) => {
                if(err) throw err;
                console.log("Deleted Role: " + answer.roleNameForDelete);
       

                showAllRoles();
           
            })
        })
    })
};




//function to delete an Employee
deleteEmployees = () => {

    const employeeListForDelete = `SELECT * FROM employee`;

    db.query(employeeListForDelete, (err, allEmployeesForDelete) => {
        if(err) throw err;

        const employeeChoicesForDelete = allEmployeesForDelete.map(employee => {
            const employeeChoiceForDelete = {name: employee.first_name + " " + employee.last_name, value: employee.id};
            return employeeChoiceForDelete;
        })

        inquirer.prompt([
            {
                type: "list",
                message: "Which employee do you want to remove?",
                name: "employeeNameForDelete",
                choices: employeeChoicesForDelete
            }
        ])
        .then(answer => {
            const sql = `DELETE FROM employee WHERE id = ?`;
            const params = [answer.employeeNameForDelete]
            db.query(sql, params, (err, result) => {
                if(err) throw err;
                console.log("Removed employee: " + answer.employeeNameForDelete);
                

                showAllEmployees();
      
            })
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
            // return;
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
            // return;
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

            updateEmployeeRole();
        }

        if(initialChoices === "Update employee manager"){

            updateEmployeeManager();
        }

        if(initialChoices === "View employees by manager"){

            viewEmployeesByManager();
        }

        if(initialChoices === "View employees by department"){

            viewEmployeesByDepartment();
        }

        if(initialChoices === "Delete departments"){

            deleteDepartments();
        }

        if(initialChoices === "Delete roles"){

            deleteRoles();
        }

        if(initialChoices === "Delete employees"){

            deleteEmployees();
        }

        if(initialChoices === "View department budget"){

            viewDepartmentBudget();
        }


    });
}



