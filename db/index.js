//require the sql file
const db = require('./sql')

//create a class called Query
class Query {
    //create constructor with the connection
    constructor(connection){
        this.connection = connection;
    }
    //this method is a helper method to be called within this method for get queries
    runGetQuery(query){
        return this.connection.promise().query(query);
    }
    //this method is a helper method to be calles within this method for add/update queires
    runAddQuery(query, addData){
        return this.connection.promise().query(query, addData);
    }
    //runs get departments query
    getDepartments() {
        const query = 
        'SELECT department.id, department.name FROM department;';
        return this.runGetQuery(query);
    }
    //runs get roles query
    getRoles() {
        const query = 
        'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;';
        return this.runGetQuery(query);
    }
    //runs get manager query
    getManager() {
        const query = 
                // left join will get everything from the left table and for the right table only the matching columns 
            'Select employee.id, employee.first_name, employee.last_name, role.title , department.name AS Department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;';
            return this.runGetQuery(query);
        }
    //runs the get employees query
    getEmployees() {
        const query = 
            'Select employee.id, employee.first_name, employee.last_name, role.title AS Role, department.name AS department, role.salary, employee.manager_id, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee manager on manager.id = employee.manager_id';
            return this.runGetQuery(query);
        }
    //runs the add department query
    addDepartment(newDepartmentName) {
        const query = 'INSERT INTO department (name) VALUES (?);';
        return this.runAddQuery(query, newDepartmentName);
    }
    //runs the add role query
    addRole(roleName, roleSalary, selectedDepartment) {
        const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);'
        return this.runAddQuery(query, [roleName, roleSalary, selectedDepartment]);

    }
    //runs the add employee query
    addEmployee(firstName, lastName, roleId, managerId){
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);'
        return this.runAddQuery(query, [firstName, lastName, roleId, managerId]);
    }
    //runs the update employee role query
    updateEmployeeRole(roleId, employeeId){
        const query = "UPDATE employee SET role_id = ? WHERE id = ?"
        return this.runAddQuery(query, [roleId, employeeId]);
    }
}
//expor the class with an input of the db (SQL connection)
module.exports = new Query(db);