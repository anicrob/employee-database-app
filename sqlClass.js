const db = require('./db/sql')
class Query {
    getDepartments() {
        const query = 
        'SELECT department.id AS Department_ID, department.name AS Department_Name FROM department;';
        db.promise().query(query)
        .then((err, result) => {
            if(err) {
                console.log('There was an issue finding the departments in the database.', err);
                return;
            } else {
                console.log(result);
            }  
        });
    }
    getRoles() {
        const query = 
        'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;';
        db.promise().query(query)
    }
    getManager() {
        const query = 
                // left join will get everything from the left table and for the right table only the matching columns 
            'Select employee.id, employee.first_name, employee.last_name, role.title , department.name AS Department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;';
            db.promise().query(query)
    }
    getEmployees() {
        const query = 
            'Select employee.id AS Employee ID, employee.first_name AS Employee First Name, employee.last_name AS Employee_Last_Name, role.title AS Employee_Job_Title, department.name AS Employee_Department, role.salary AS Employee_Salary, employee.manager_id AS Employee_Manager FROM employee LEFT JOIN role ON role.id = employee.manager_id LEFT JOIN department ON department.id = role.department_id;';
            db.promise().query(query)
    }
    addDepartment(newDepartmentName) {
        const query = 'INSERT INTO department (name) VALUES (?)'
        db.promise().query(query, newDepartmentName) 
    }
    
    addRole(roleName, roleSalary, selectedDepartment) {
        const query = 'INSERT INTO role (name, salary, department_id) VALUES (?);'
        db.promise().query(query, [roleName, roleSalary, selectedDepartment])
    }
    addEmployee(firstName, lastName, roleId, managerId){
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)'
                db.promise().query(query, [firstName, lastName, roleId, managerId])
    }
}
module.exports = Query