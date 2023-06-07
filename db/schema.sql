DROP DATABASE IF EXISTS employeeshw_db;
CREATE DATABASE employeeshw_db;


USE employeeshw_db;


CREATE TABLE department (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(30)
);

CREATE TABLE role (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(30),
 salary DECIMAL(13,2),
 department_id INT,
 FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 first_name VARCHAR(30),
 last_name VARCHAR(30),
 role_id INT,
 manager_id INT REFERENCES employee(id) ON DELETE SET NULL,
 FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);