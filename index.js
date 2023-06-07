const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employeeshw_db'
    },
    console.log(`Connected to the classlist_db database.`)
  );
        
const addDepartment = () => {
    //prompt: name of the department
    inquirer
    .prompt(
        [
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What would you like the new department to be called?',
            }
        ])
     //then add to database
    .then(({newDepartmentName}) => {
        const query = 'INSERT INTO department (name) VALUES (?)'
        db.query(query, newDepartmentName, (err, result) => {
            if(err) {
                res.status(400).json('There was an issue finding the departments in the database.');
                return;
            } else {
                return result;
            }  
        })
    })
    .catch((err) => {
        console.log('There was an error processing the request.');
    });
}

const addRole = () => {
    //define function to get department list names
    const findDepartmentNames = () => {
        const query = 
        'SELECT department.name AS Department Name FROM department';
        db.query(query, (err, result) => {
            if(err) {
                res.status(400).json('There was an issue finding the departments in the database.');
                return;
            } else {
                return arrayFrom(result);
            }
        })
    };
    //prompt: name, salary, department
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'What would you like the new role to be called?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'How much does this role make a year?'
        },
        {
            type: 'list',
            name: 'selectedDepartment',
            message: 'Which department is this role part of?',
            choices: findDepartmentNames()
        }
    ])
    //then add role to database
    .then(({newRole, roleSalary, selectedDepartment}) => {
        //right now I'm putting in the department name not the id!
        const queryFindDepartmentId = "SELECT department.id FROM role JOIN department ON role.department_id = department.id WHERE department.name = ?"
        db.query(queryFindDepartmentId, selectedDepartment, (err, id) => {
            if(err) {
                res.status(400).json('There was an issue finding the department id in the database.');
                return;
            } else {
                const query = 'INSERT INTO role (name, salary, department_id) VALUES (?)'
                db.query(query, [newRole, roleSalary, id], (err, result) => {
                    if(err) {
                        res.status(400).json('There was an issue creating the role in the database.');
                        return;
                    } else {
                        return result;
                    }  
                })            
            }
        })
        
    })
    .catch((err) => {
        console.log('There was an error processing the request.');
    });
}

// a function to initialize the app
const init = () => {
    inquirer
    .prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'userRequest',
        choices: [
            'View all departments', 
            'View all roles', 
            'View all employees', 
            'Add a department', 
            'Add a role', 
            'Add an employee', 
            'Update an employee role'
          ]  
        }])
    .then(({userRequest}) => {
        if(userRequest === 'View all departments'){
            //view all departments: department names and department ids
            const query = 
            'SELECT department.id AS Department ID, department.name AS Department Name FROM department';
            db.query(query, (err, result) => {
                if(err) {
                    res.status(400).json('There was an issue finding the departments in the database.');
                    return;
                } else {
                    console.log(result);
                }  
            });
        } else if (userRequest === 'View all roles'){
            //job title, role id, department the role belongs to, and salary for the role
            const query = 
            'SELECT role.title AS Job Title, department.name AS Department Name, role.salary AS Role Salary FROM role JOIN department ON department.id = role.department_id';
            db.query(query, (err, result) => {
                if(err) {
                    res.status(400).json('There was an issue finding the roles in the database.');
                    return;
                } else {
                    console.log(result);
                }            
            });
        } else if (userRequest === 'View all employees'){
            //employee data, including employee ids, first names, last names, job titles, 
            //departments, salaries, and managers that the employees report to
            const query = 
            'Select employee.id AS Employee ID, employee.first_name AS Employee First Name, employee.last_name AS Employee Last Name, role.title AS Employee Job Title, department.name AS Employee Department, role.salary AS Employee Salary, employee.manager_id AS Employee Manager FROM employee JOIN role ON role.id = employee.manager_id JOIN department ON department.id = role.department_id';
            db.query(query, (err, result) => {
                if(err) {
                    res.status(400).json('There was an issue finding the employees in the database.');
                    return;
                } else {
                    console.log(result);
                }
            });
        } else if (userRequest === 'Add a department'){
            const result = addDepartment();
            console.log(result);
        } else if (userRequest === 'Add a role'){
            const result = addRole();
            console.log(result);
        } else if (userRequest === 'Add an employee'){
            //prompt: enter the employee’s first name, last name, role, and manager, 
            //and that employee is added to the database
            console.log('still working on it');
        } else if (userRequest === 'Update an employee role'){
            //I am prompted to select an employee to update and their new role 
            //and this information is updated in the database 
            console.log('still working on it');
        }
    })
    .catch((err) => {
        console.log('There was an error processing the request.')
    })
}

// Function call to initialize app
init(); 