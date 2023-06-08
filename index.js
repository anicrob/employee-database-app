const inquirer = require('inquirer');
const Query = require('./sqlClass')

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
    .then(({newDepartmentName}) => {
       const createDepartment = new Query;
       createDepartment.addDepartment(newDepartmentName)
        .then((err, result) => {
            if(err) {
                res.status(400).json('There was an issue finding the departments in the database.');
                return;
            } else {
                console.log('Department has been created successfully!');
            }  
        })
    })
    .catch((err) => {
        console.log('There was an error processing the request.');
    });
}
const addRole = () => {
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
        const roleName = res.newRole;
        const roleSalary = res.roleSalary;
        const findDepartments = new Query();
        findDepartments.getDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({id, name}) => ({
                name,
                value: id
            }))
        inquirer
        .prompt(        {
            type: 'list',
            name: 'selectedDepartment',
            message: 'Which department is this role part of?',
            choices: departmentChoices
        })
        .then(res => {
            let selectedDepartment = res.selectedDepartment;
            //then add role to database
            const createRole = new Query();
            createRole.addRole(roleName, roleSalary, selectedDepartment)
                .then((err, result) => {
                    if(err) {
                        res.status(400).json('There was an issue creating the role in the database.');
                        return;
                    } else {
                        console.log('The new role has been created sucessfully');
                    }
                })  
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
        let firstName = res.firstName;
        let lastName = res.lastName;
        const findRoles = new Query();
        findRoles.getRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({id, title}) => ({
                name: title,
                value: id
            }))
            inquirer
            .prompt({
                type: 'list',
                name: 'roleId',
                message: 'What is the role of the employee?',
                choices: roleChoices
            })
            .then(res => {
                let roleId = res.roleId
                const findManagers = new Query();
                findManagers.getManager()
                .then(([rows]) => {
                    let employees = rows;
                    const managerChoices = employees.map(({id, first_name, last_name}) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));
                    managerChoices.unshift({name:"none", value: null})
                    inquirer
                    .prompt({
                        type: 'list',
                        name: 'managerId',
                        message: 'What is the role of the employee?',
                        choices: managerChoices
                    })
                    .then(res => {
                        let managerId = res.managerId
                    //and add new employee to the database
                    const createEmployee = new Query();
                    createEmployee.addEmployee(firstName, lastName, roleId, managerId)
                    .then((err, result) => {
                        if(err) {
                            res.status(400).json('There was an issue creating the employee in the database.');
                            return;
                        } else {
                            console.log(result);
                        }  
                    })
                })  
            })
        })
    }) 
})}
const updateEmployee = () => {
            //I am prompted to select an employee to update and their new role 
            //and this information is updated in the database 
            console.log('still working on it');
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
           const viewDepartments = new Query;
           viewDepartments.getDepartments()
        } else if (userRequest === 'View all roles'){
            //job title, role id, department the role belongs to, and salary for the role
           const findRoles = new Query();
           findRoles.getRoles()
            .then(err, result => {
                if(err) {
                   console.log('There was an issue finding the roles in the database.');
                    return;
                } else {
                    console.log(result);
                }            
            });
        } else if (userRequest === 'View all employees'){
            const findEmployees = new Query();
            findEmployees.getEmployees()
            .then((err, result) => {
                if(err) {
                    res.status(400).json('There was an issue finding the employees in the database.');
                    return;
                } else {
                    console.log(result);
                }
            });
        } else if (userRequest === 'Add a department') addDepartment();
        else if (userRequest === 'Add a role') addRole();
        else if (userRequest === 'Add an employee') addEmployee();
        else if (userRequest === 'Update an employee role') updateEmployee();
    })
    .catch((err) => {
        console.log('There was an error processing the request.', err)
    })
}

// Function call to initialize app
init(); 