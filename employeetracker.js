var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "milkshake",
    database: "employee_trackerdb"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "whatToDo",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Employees", "View Departments", "Add Employee", "Add Department", "View Roles", "Add Roles", "EXIT"]
        })
        .then(function (answer) {
            console.log(answer.whatToDo)
            switch (answer.whatToDo) {
                case "Add Employee":
                    addEmployee();
                    break;
                case "View Employees":
                    viewEmployees();
                    break;
                case "View Departments":
                    viewDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "Add Roles":
                    addRole();
                    break;
                case "EXIT":
                    connection.end();
                    break;
            }
        });
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "employees",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {

                            choiceArray.push(results[i].last_name);
                        }
                        return choiceArray;
                    },
                    message: "What employee would you like to update?"
                }
            ])
            .then(function (answer) {
                console.log(answer.employees)
                updateEmployee(answer.employees)
            })
    })
}


function addEmployee() {
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is their First Name?"
            },
            {
                name: "last_name",
                type: "input",
                message: "What is their Last Name?"
            },
            {
                name: "role_id",
                type: "input",
                message: "What is their role?"
            },
            {
                name: "manager_id",
                type: "input",
                message: "Who is their Manager"
            }

        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your employee was created successfully!");
                    start();
                }
            );
        });
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "departments",
                    type: "list",
                    choices: function () {
                        var deptArray = [];
                        for (var i = 0; i < results.length; i++) {

                            deptArray.push(results[i].name);
                        }
                        return deptArray;
                    },
                    message: "What department would you like to update?"
                }
            ])
            .then(function (answer) {
                console.log(answer.departments)
                updateDepartment(answer.departments)
                
            })
    })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the Department Name?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.name
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was created successfully!");
                    start();
                }
            );
        });
}

function updateEmployee(lastName) {
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is their First Name?"
            },
            {
                name: "last_name",
                type: "input",
                message: "What is their Last Name?"
            },
            {
                name: "role_id",
                type: "input",
                message: "What is their role?"
            },
            {
                name: "manager_id",
                type: "input",
                message: "Who is their Manager"
            },


        ]).then(function (answer) {
            connection.query(
                "UPDATE employee SET ?,?,?,? WHERE ?",
                [
                    {
                        first_name: answer.first_name
                    },
                    {
                        last_name: answer.last_name
                    },
                    {
                        role_id: answer.role_id
                    },
                    {
                        manager_id: answer.manager_id
                    },
                    {
                        last_name: lastName
                    }
                ],
                function (error) {
                    if (error) throw err;
                    console.log("Employee updated successfully!");
                    start();
                }
            );
        })
}

function updateDepartment(deptName) {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the department name?"
            },
        ]).then(function (answer) {
            connection.query(
                "UPDATE department SET ? WHERE ?",
                [
                    {
                        name: answer.name
                    },
                    {
                        name: deptName
                    },
                ],
                function (error) {
                    if (error) throw err;
                    console.log("Department updated successfully!");
                    start();
                }
            );
        })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "roles",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {

                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "What role would you like to update?"
                }
            ])
            .then(function (answer) {
                console.log(answer.roles)
                updateRole(answer.roles)
            })
    })
}


function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is their salary?"
            },
            {
                name: "department_id",
                type: "input",
                message: "What is their department?"
            }

        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your role was created successfully!");
                }
            );
        });
}


function updateRole(roleTitle) {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the role title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the role salary?"
            },
            {
                name: "department_id",
                type: "input",
                message: "What department is this in?"
            },
        ]).then(function (answer) {
            connection.query(
                "UPDATE role SET ?,?,? WHERE ?",
                [
                    {
                        title: answer.title
                    },
                    {
                        salary: answer.salary
                    },
                    {
                        department_id: answer.department_id
                    },
                    {
                        title: roleTitle
                    },
                ],
                function (error) {
                    if (error) throw error;
                    console.log("Role updated successfully!");
                    // start();
                }
            );
        })
}