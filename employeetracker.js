var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3000,
  user: "root",
  password: "milkshake",
  database: "employee_trackerdb"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
  .prompt({
    name: "whatToDo",
    type: "input",
    message: "What would you like to do?",
    choices: ["View Employees", "View Departments", "Add Employee", "Add Department"]
  })
    .then(function(answer) {
      if (answer.whatToDo === "Add Employees") {
        addEmployee();
      }
      else if(answer.whatToDo === "Add Department") {
        addDepartment();
      } else{
        connection.end();
      }
    });
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
    //   {
    //     name: "startingBid",
    //     type: "input",
    //     message: "What would you like your starting bid to be?",
    //     validate: function(value) {
    //       if (isNaN(value) === false) {
    //         return true;
    //       }
    //       return false;
    //     }
    //   }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id || 0,
          manager_id: answer.manager_id || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your employee was created successfully!");
          start();
        }
      );
    });
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
      .then(function(answer) {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.name
          },
          function(err) {
            if (err) throw err;
            console.log("Your department was created successfully!");
            start();
          }
        );
      });
  }

  