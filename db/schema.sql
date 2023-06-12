--drop database if it exists then create it
DROP DATABASE IF EXISTS employeeshw_db;
CREATE DATABASE employeeshw_db;

--use the database
USE employeeshw_db;

--create department table with id and name fields
CREATE TABLE department (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(30)
);

--create table called role with id, title, salary, department_id fields
CREATE TABLE role (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(30),
 salary DECIMAL(13,2),
 department_id INT,
 FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

--create table called employee with id, first_name, last_name, role_id, manager_id fields
CREATE TABLE employee (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 first_name VARCHAR(30),
 last_name VARCHAR(30),
 role_id INT,
 manager_id INT, 
 FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL,
 FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);