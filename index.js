const mysql = require("mysql");
const inquirer = require("inquirer");
// const util = require("util");
// const fs = require("fs");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    password: "Discodog@1",
    database: "employeeTracker_DB"
});

connection.connect((err) => {
    if (err) throw err;
    start();
});

// questions

function start() {
    return inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?"
        choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Roles"]

        })
        .then((answer) => {
            if (answer.action === "View All Employees") {
                viewAllEmp()
            }
            else if (answer.action === "View All Employees By Department") {
                viewAllEmpDept()
            }
            else if (answer.action === "View All Employees By Manager") {

            }
            else if (answer.action === "Add Employee") {

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
    connection.query(
        `SELECT id, first_name, last_name, title, department, salary, manager
        FROM employee, role, department
        WHERE employee.role_id = role.role_id
        AND role.department_id = department.department_id
        ORDER BY id;`,
        function (err, results) {
            if (err) throw err;
            console.log(results)
        }
    start();
    )
};

function viewAllEmpDept() {


    connection.query(
        
    )

}
