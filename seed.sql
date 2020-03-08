DROP DATABASE IF EXISTS employeeTrackerDB;

CREATE DATABASE employeeTrackerDB;

USE employeeTrackerDB;

CREATE TABLE department (
	id INT NOT NULL,
    name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
	manager_id INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (id, name)
VALUES (1, "Sales"),(2, "Engineering"),(3, "Finance"), (4, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 1), (2, "Salesperson", 80000, 1), (3, "Lead Engineer", 150000, 2), (4, "Software Engineer", 120000, 2), (5, "Accountant", 125000, 3), (6, "Legal Team Lead", 250000, 4), (7, "Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Geddy", "Lee", 3), ("Claudio", "Sanchez", 5), ("Les", "Claypool", 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jerry", "Garcia", 1, 1), ("Nathaniel", "Rateliff", 2, 4), ("Gary", "Clark Jr.", 4, 2), ("Robert", "Plant", 7, 3), ("Roger", "Waters", 4, 2)