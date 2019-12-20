const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const figlet = require('figlet');

figlet('Employee Manager', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "Discodog@1",
    database: "employeeTracker_DB"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("DB connected!")
    start();
});

// questions

function start() {
    inquirer
        .prompt(
            {
                name: "action",
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Roles"]
            }
        )
        .then((answer) => {
            if (answer.action === "View All Employees") {
                viewAllEmp();
            }
            else if (answer.action === "View All Employees By Department") {
                viewAllEmpDept();
            }
            else if (answer.action === "View All Employees By Manager") {
                viewAllEmpMan();
            }
            else if (answer.action === "Add Employee") {
                addEmployee();
            }
            else if (answer.action === "Remove Employee") {

            }
            else if (answer.action === "Update Employee Role") {

            }
            else if (answer.action === "Update Employee Manager") {

            }
            else if (answer.action === "View All Roles") {

            }

        })
}

function viewAllEmp() {
    connection.query("SELECT id, first_name, last_name, title, name, salary, manager_id FROM employee, role, department WHERE employee.role_id = role.role_id AND role.department_id = department.department_id ORDER BY id",
        function (err, results) {
            if (err) throw err;
            console.log("\n" + "\n")
            console.table(results)
            console.log("\n" + "Move arrows to make another choice")
        }
    )
    start()
};

function viewAllEmpDept() {
    inquirer
        .prompt({
            name: "dept",
            type: "list",
            message: "What department would you like to view employees for?",
            choices: ["Engineering", "Finance", "Legal", "Sales"]
        })
        .then((answer) => {
            var query = "SELECT department.name, employee.first_name, employee.last_name, role.title FROM ((role INNER JOIN department ON department.department_id = role.department_id) INNER JOIN employee ON role.role_id = employee.role_id) WHERE ?";
            connection.query(query, { name: answer.dept }, function (err, res) {
                if (err) throw err;
                console.log("\n" + "\n")
                console.table(res)
                console.log("\n" + "Move arrows to make another choice")
            })
        })
        .then(() => {
            start();
        })
}

function viewAllEmpMan() {

    connection.query("SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL",
        function (err, results) {
            if (err) throw err;

            inquirer
                .prompt({
                    name: "manager",
                    type: "list",
                    message: "What manager would you like to view employees for?",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name);
                        }
                        return choiceArray;
                    }
                })
                .then((answer) => {
                    let query = "SELECT id, first_name, last_name, title, name, salary FROM employee LEFT JOIN role ON (employee.role_id = role.role_id) LEFT JOIN department ON (role.department_id = department.department_id) WHERE ?";

                    let answerArray = Object.values(answer)
                    let answerId = answerArray[0].split(" ")
                    console.log(answerId[0])

                    connection.query(query, { manager_id: answerId[0] }, function (err, res) {
                        if (err) throw err;

                        console.log(query)
                        console.log("\n" + "\n")
                        console.table(res)
                        console.log("\n" + "Move arrows to make another choice")

                    });
                })
                .then(() => {
                    start();
                })
        });
}

// function addEmployee() {

//     //do a bunch of these for each entry
//     connection.query("INSERT INTO tasks (task) VALUES (?)", [req.body.task], function (err, result) {
//         if (err) throw err;
//         INSERT INTO tasks//table// (task//column) VALUES (?)
//     }

