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
VALUES (1, "sales"),(2, "marketing"),(3, "retail");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "sales manager", 70000, 1), (2, "marketing manager", 60000, 2), (3, "retail manager", 50000, 3), (4, "sales employee", 35000, 1), (5, "marketing employee", 30000, 2), (6, "retail employee", 25000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Geddy", "Lee", 1), ("Claudio", "Sanchez", 2), ("Les", "Claypool", 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Serj", "Tankian", 4, 1), ("Nathaniel", "Rateliff", 4, 2), ("Joe", "Lewis", 4, 3), ("Gary", "Clark", 5, 1), ("Robert", "Plant", 5, 2), ("Bon", "Scott", 5, 3), ("Ozzy", "Osbourne", 6, 1), ("Roger", "Waters", 6, 2), ("Jerry", "Garcia", 6, 3)