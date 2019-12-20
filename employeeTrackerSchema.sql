DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department(
    department_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (department_id)
    
);

CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL, 
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
   
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role (role_id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department (name) VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal")
;

INSERT INTO role (title, salary, department_id)
VALUES ("Shitkicker", 100000, 1),
("Soulsucker", 80000, 1),
("Crafty MoFo", 150000, 2),
("Fubar-er", 40000, 2),
("Ambulance Chaser", 200000, 4),
("GoFer", 60000, 4),
("Numbah Crunchah", 95000, 3),
("Bit Byter", 76000, 3)
;

-- Managers
INSERT INTO employee (first_name, last_name, role_id)
VALUES 
("Jimmy", "Two Chins",1),
("Jillian", "TakeNoShit", 3),
("Martha", "TheHammah", 4)
;

-- Underlings
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Horatio", "GetErDone", 2, 3),
("Julio", "GiveTwoShits", 5, 5),
("Matty", "LadderClimbah", 8, 6),
("JoJo", "EyesOnPrize", 7, 4)
;


SELECT id, first_name, last_name, title, name, salary, manager_id 
FROM employee, role, department 
WHERE employee.role_id = role.role_id AND role.department_id = department.department_id ORDER BY id;

SELECT department.name, employee.first_name, employee.last_name, role.title 
FROM ((role 
INNER JOIN department ON department.department_id = role.department_id) 
INNER JOIN employee ON role.role_id = employee.role_id) WHERE department.name = "Sales";

SELECT first_name, last_name FROM employee WHERE manager_id IS NOT NULL;
           


