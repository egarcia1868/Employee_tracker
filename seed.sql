DROP DATABASE IF EXISTS employeeTrackerDB;

CREATE DATABASE employeeTrackerDB;

USE employeeTrackerDB;

CREATE TABLE department (
	id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
	manager_id INT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);

INSERT INTO department (id, name)
VALUES (1, "Sales"),(2, "Engineering"),(3, "Finance"), (4, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 1), (2, "Salesperson", 80000, 1), (3, "Lead Engineer", 150000, 2), (4, "Software Engineer", 120000, 2), (5, "Accountant", 125000, 3), (6, "Legal Team Lead", 250000, 4), (7, "Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Geddy", "Lee", 3), ("Claudio", "Sanchez", 5), ("Les", "Claypool", 6), ("DELETE", "ME", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jerry", "Garcia", 1, 1), ("Nathaniel", "Rateliff", 2, 4), ("Gary", "Clark Jr.", 4, 2), ("Robert", "Plant", 7, 3), ("Roger", "Waters", 4, 2), ("DELETE", "ME1", 4, 1),("DELETE", "ME2", 4, 4);

-- SELECT employee.id, employee.first_name, employee.last_name, employee.role_id

SELECT role.title FROM role;

-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.first_name+" "+employee.last_name 
-- FROM ((employee INNER JOIN role ON employee.role_id=role.id)INNER JOIN department ON department.id=employee.department_id)
-- INNER JOIN employee ON employee.manager_id=employee.id);

SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id 
FROM employee INNER JOIN role ON employee.role_id=role.id;
-- 
-- SELECT employee.first_name, employee.last_name FROM employee WHERE employee.id=res1[5];
-- 

SELECT department.name FROM role INNER JOIN department ON role.department_id=department.id AND role.id=1;

SELECT employee.id FROM role INNER JOIN employee ON role.id=employee.role_id AND role.title="DELETE ROLE";

-- SELECT department.name FROM role INNER JOIN department ON role.department_id=department.id;
-- INNER JOIN department ON department.id=employee.department_id);
-- WHERE employee.manager_id=employee.id);

-- SELECT employee.first_name FROM employee WHERE employee.first_name="geddy"