const inquirer = require('inquirer');
const Query = require('./db/index')

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
        Query.addDepartment(newDepartmentName)
        .then(() => console.log(`The department was added successfully to the database.`))
        .then(() => init())
        .catch(err => console.log('There was an error adding the department to the database.', err));
    })
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
        Query.getDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({id, name}) => ({
                name,
                value: id
            }))
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
        let firstName = res.firstName;
        let lastName = res.lastName;
        Query.getRoles()
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
                Query.getManager()
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
            Query.getDepartments()
            .then(([rows]) => {
                let departments = rows;
                console.log(departments)
            })
            .then(() => init())
            .catch('There was an error', err);
        } else if (userRequest === 'View all roles'){
            //job title, role id, department the role belongs to, and salary for the role
            Query.getRoles()
            .then(([rows]) => {
                let roles = rows;
                console.log(roles)
            })
            .then(() => init())
            .catch('There was an error', err);
        } else if (userRequest === 'View all employees'){
            Query.getEmployees()
            .then(([rows]) => {
                let employees = rows;
                console.log(employees)
            })
            .then(() => init())
            .catch('There was an error', err);
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