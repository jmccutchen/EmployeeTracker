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
    CONSTRAINT fk_dept_id FOREIGN KEY (department_id) REFERENCES department(department_id)
   
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES role (role_id),
    CONSTRAINT fk_manager_id FOREIGN KEY (manager_id) REFERENCES employee(id)
);



