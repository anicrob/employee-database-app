const inquirer = require('inquirer');
const Query = require('./db');
const cTable = require('console.table');


const addDepartment = () => {
    //prompt: name of the department
    inquirer
    .prompt(
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What would you like the new department to be called?',
            }
        )
     //then add to database
    .then(({newDepartment}) => {
        Query.addDepartment(newDepartment)
        .then(() => console.log(`The department was added successfully to the database.`))
        .then(() => init())
        .catch(err => console.log('There was an error adding the department to the database.', err));
    })
}
const addRole = () => {
    //prompt: name of new role and salary
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
        }])
    .then(res => {
        // assign variables to result answers
        const roleName = res.newRole;
        const roleSalary = res.roleSalary;
        //call getDepartment() function
        Query.getDepartments()
        .then(([rows]) => {
            let departments = rows;
            //map the info, so we only get the id and name 
            const departmentChoices = departments.map(({id, name}) => 
            //create an object with name and value properties
            ({
                name: `${name}`,
                value: id
            }));
        // using the departmentChoices object for the choices, prompt the department question
        inquirer
            .prompt(        
            {
                type: 'list',
                name: 'selectedDepartment',
                message: 'Which department is this role part of?',
                choices: departmentChoices
            })
        .then(res => {
            let selectedDepartment = res.selectedDepartment;
            //then add role to database
            Query.addRole(roleName, roleSalary, selectedDepartment)
                .then(() => console.log('The new role has been created sucessfully'))
                .then(() => init())
                .catch(err => console.log('There was an error processing the request.', err))
            })           
        })
    }) 
}
const addEmployee = () => {
    //prompt: enter the employee’s first name, last name, role, and manager, 
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?'
        },
    ])
    .then(res => {
        //assign variables to result answers
        let firstName = res.firstName;
        let lastName = res.lastName;
        //call getRoles() 
        Query.getRoles()
        .then(([rows]) => {
            let roles = rows;
            // map the roles to only get the id and title
            const roleChoices = roles.map(({id, title}) => ({
                //create an object to use for the role choices
                name: title,
                value: id
            }))
            //prompt: role of employee
            inquirer
            .prompt({
                type: 'list',
                name: 'roleId',
                message: 'What is the role of the employee?',
                choices: roleChoices
            })
            .then(res => {
                let roleId = res.roleId
                //call getManager()
                Query.getManager()
                .then(([rows]) => {
                    let employees = rows;
                    //map so we only get the id, first_name, and last_name for the managerChoices
                    const managerChoices = employees.map(({id, first_name, last_name}) => (
                        //create an object for the manager choices
                        {
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));
                    //remove any null values and replace with none
                    managerChoices.unshift({name:"none", value: null})
                    //prompt: mananger for employee
                    inquirer
                    .prompt({
                        type: 'list',
                        name: 'managerId',
                        message: 'What is the manager of the employee?',
                        choices: managerChoices
                    })
                    .then(res => {
                        let managerId = res.managerId
                        //and add new employee to the database
                        Query.addEmployee(firstName, lastName, roleId, managerId)
                            .then(() => console.log('The new role has been created sucessfully'))
                            .then(() => init())
                            .catch(err => console.log('There was an error processing the request.', err));
                    })    
                })
            })
        }) 
    })
}
const updateEmployeeRole = () => {
//call getEmployees()
Query.getEmployees()
.then(([rows]) => {
    let employeeList = rows;
    // map the employeeList to only get the id, first_name, and last_name
    const employeeChoices = employeeList.map(({id, first_name, last_name}) => ({
        //use that info to create an object for the employeeChoices
        name: `${first_name} ${last_name}`,
        value: id
    }))
    //prompt: which employee to update
        inquirer
        .prompt(        
        {
            type: 'list',
            name: 'employeeUpdate',
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        })
        .then(({employeeUpdate}) => {
            //the response is the Id
            let employeeId = employeeUpdate;
            //call getRoles()
            Query.getRoles()
            .then(([rows]) => {
                let roles = rows;
                //map to only get the id and title
                const roleChoices = roles.map(({id, title}) => (
                    //make that info an object
                    {
                    name: title,
                    value: id
                    }   
                ))
                //prompt: new role for empoyee
                inquirer
                    .prompt(
                        {
                            type: 'list',
                            name: 'newEmployeeRole',
                            message: "Which new role do you want this employee to have?",
                            choices: roleChoices
                        }
                    )
                .then(({newEmployeeRole}) => {
                    let roleId = newEmployeeRole
                    //update the employee role
                    Query.updateEmployeeRole(roleId, employeeId)
                    .then(() => console.log('The employee has been updated sucessfully'))
                    .then(() => init())
                    .catch(err => console.log('There was an error processing the request.', err));
                })
            })  
        })   
    }
)}
// a function to initialize the app
const init = () => {
// WHEN I start the application THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
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
            'Update an employee role',
            'Quit'
          ]  
        }])
    .then(({userRequest}) => {
        switch(userRequest){
            // WHEN I choose to view all departments
            case 'View all departments':
            Query.getDepartments()
            .then(([rows]) => {
                let departments = rows
                // THEN I am presented with a formatted table showing department names and department ids
                console.table(departments)
            })
            //return to home page
            .then(() => init())
            .catch(err => console.log('There was an error'));
            break;
            // WHEN I choose to view all roles
            case 'View all roles':             
            Query.getRoles()
            .then(([rows]) => {
                let roles = rows;
                // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
                console.table(roles)
            })
            .then(() => init())
            .catch(err => console.log('There was an error'));
            break;
            // WHEN I choose to view all employees
            case 'View all employees':
                Query.getEmployees()
                .then(([rows]) => {
                    let employees = rows;
                    // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
                    console.table(employees)
                })
                .then(() => init())
                .catch(err => console.log('There was an error', err));
            break;
            // WHEN I choose to add a department
            // THEN I am prompted to enter the name of the department and that department is added to the database
            case 'Add a department': addDepartment();
            break;
            // WHEN I choose to add a role
            // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
            case 'Add a role': addRole();
            break;
            // WHEN I choose to add an employee
            // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
            case 'Add an employee': addEmployee();
            break;
            // WHEN I choose to update an employee role
            // THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
            case 'Update an employee role':updateEmployeeRole();
            break;
            case 'Quit': return;
            default:
                console.log('There was an error processing the request.')
        }
    })
}
// Function call to initialize app
init(); 