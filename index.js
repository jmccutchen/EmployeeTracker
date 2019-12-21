const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const figlet = require('figlet');
const dotenv = require('dotenv').config()

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
    user: process.env.DB_USER,
    port: 3306,
    password: process.env.DB_PW,
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
                removeEmp();
            }
            else if (answer.action === "Update Employee Role") {
                updateEmpRole();
            }
            else if (answer.action === "Update Employee Manager") {
                console.log("\n")
                console.log("You will need approval from YOUR manager to carry out this function. Piss off.")
                console.log("\n")
                start()
            }
            else if (answer.action === "View All Roles") {
                viewAllRoles();
            }

        })
}

function viewAllEmp() {
    connection.query("SELECT id, first_name, last_name, title, name, salary, manager_id FROM employee, role, department WHERE employee.role_id = role.role_id AND role.department_id = department.department_id ORDER BY id",
        function (err, results) {
            if (err) throw err;
            console.log("\n" + "\n")
            console.table(results)
            console.log("\n")
            start()
        }
    )

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
                console.log("\n")
                start();
            })
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

                    connection.query(query, { manager_id: answerId[0] }, function (err, res) {
                        if (err) throw err;
                        console.log("\n")
                        console.table(res)
                        console.log("\n")
                        start();
                    });
                })

        });
}

function addEmployee() {

    connection.query("SELECT title FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first",
                    type: "input",
                    message: "What is employee's first name?"
                },
                {
                    name: "last",
                    type: "input",
                    message: "What is employee's last name?"
                }

            ])
            .then((answer) => {
                let query = "INSERT INTO employee (first_name, last_name) VALUES (?,?)"
                let values =

                    connection.query(query,
                        [answer.first, answer.last],
                        function (err, result) {
                            if (err) throw err;

                        })

            })
            .then(() => {
                connection.query("SELECT title, role_id FROM role", function (err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "role",
                                type: "list",
                                message: "What role do they have?",
                                choices: function () {
                                    var choiceArray = [];
                                    for (var i = 0; i < results.length; i++) {
                                        choiceArray.push(results[i].role_id + " " + results[i].title);
                                    }

                                    return choiceArray;
                                }
                            }
                        ])

                        .then((answer) => {
                            let query = "UPDATE employee SET role_id = ? WHERE id = LAST_INSERT_ID()";
                            let answerArray = Object.values(answer)
                            let answerId = answerArray[0].split(" ")
                            let roleId = answerId[0]
                            connection.query(query, roleId, function (err, res) {
                                if (err) throw err;

                            });
                        })
                        .then(() => {
                            connection.query("SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL and NOT id = LAST_INSERT_ID() ",
                                function (err, results) {
                                    if (err) throw err;

                                    inquirer
                                        .prompt({
                                            name: "manager",
                                            type: "list",
                                            message: "What manager does this employee have?",
                                            choices: function () {
                                                var choiceArray = [];
                                                for (var i = 0; i < results.length; i++) {
                                                    choiceArray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name);
                                                }
                                                return choiceArray;
                                            }
                                        })
                                        .then((answer) => {
                                            let query = "UPDATE employee SET manager_id = ? WHERE id = LAST_INSERT_ID()";
                                            let answerArray = Object.values(answer)
                                            let answerId = answerArray[0].split(" ")
                                            let managerId = answerId[0]
                                            connection.query(query, managerId, function (err, res) {
                                                if (err) throw err;
                                                console.log("\n")
                                                console.log(`Employee's manager ID was updatede to ${managerId}`)
                                                console.log("\n")
                                                start();
                                            });
                                        })

                                })


                        })
                })
            })
    })
}

function removeEmp() {
    connection.query("SELECT first_name, last_name, id FROM employee",
        function (err, results) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "removeEmp",
                        type: "list",
                        message: "What employee do you need to delete?",
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name);
                            }

                            return choiceArray;
                        }
                    }
                ])
                .then((answer) => {
                    let query = "DELETE FROM employee WHERE id= ?";
                    let answerArray = Object.values(answer)
                    let answerId = answerArray[0].split(" ")
                    let id = answerId[0]
                    connection.query(query, id, function (err, res) {
                        if (err) throw err;
                        console.log("\n")
                        console.log(`Employee ${Id} was deleted`)
                        console.log("\n")
                        start();
                    });
                })


        })
}

function updateEmpRole() {
    connection.query("SELECT id, first_name, last_name, title, role.role_id AS role_id, name FROM employee, role, department WHERE employee.role_id = role.role_id AND role.department_id = department.department_id",
        function (err, results) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "updateEmp",
                        type: "list",
                        message: "Which employee's role would you like to update?",
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name);
                            }

                            return choiceArray;
                        }
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is their new role?",
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArray.push(results[i].role_id + " " + results[i].title);
                            }

                            return choiceArray;
                        }
                    }
                ])
                .then((answers) => {
                    let query = "UPDATE employee SET role_id = ? WHERE id = ?";
                    let answerArray = Object.values(answers)
                    // to get employee ID
                    let empId = answerArray[0].split(" ")
                    let employeeId = empId[0]
                    // to get role ID
                    let role = answerArray[1].split(" ")
                    let roleId = role[0]
                    connection.query(query, [roleId, employeeId], function (err, res) {
                        if (err) throw err;
                        console.log("\n")
                        console.log(`Employee ${employeeId} was updated to role ID: ${roleId}`)
                        console.log("\n")
                        start();

                    });
                })

        })
}


function viewAllRoles() {
    connection.query("SELECT title, salary FROM role;",
        function (err, results) {
            if (err) throw err;
            console.log("\n" + "\n")
            console.table(results)
            console.log("\n" + "Move arrows to make another choice")
            start();
        }
    )
}


