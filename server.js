// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { Model, DataTypes } = require('sequelize');
const { exit } = require('process');
class employee extends Model { }

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Connected to the employee_db database.`)
);

// function to produce table results in console
resultFunction = (result) => {
    console.log("\n");
    console.table(result);
    console.log("\n");
    init()
}

// query all columns from a table
resultQuery = (table) => {
    db.query(`select * from ${table};`, (err, result) => {
        resultFunction(result);
    })
};

// options for users
const intialChoices = ["Veiw All Employees", "Add Employee", "Updated Employee Role", "View All Roles",
    "Add Role", "View All Departments", "Add Department", "Update an Employee Manager",
    "View Emloyee by Manager", "View Employees by Department", "Delete Department, Role or Employee", "View Total Department Budget", "Exit"]

// variables for delete option
const tables = ['department', 'role', 'employee']

// view all employee function
viewAllEmployees = () => {
    db.query(`select e.id as employee_id, e.first_name, e.last_name, title, name as department_name, 
    salary, m.first_name as manager_first_name, m.last_name as manager_last_name from employee m, employee e  
    JOIN role on role_id = role.id join department 
    ON role.department_id = department.id where m.id = e.manager_id;`, (err, result) => {
        resultFunction(result);
    });
}

// function to add employee
addEmployees = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'fName',
            message: `What is this employee's first name?`,
        },
        {
            type: 'input',
            name: 'lName',
            message: `What is this employee's last name?`,
        },
        {
            type: 'input',
            name: 'managerID',
            message: `What is this employee's manager's ID?`,
        },
        {
            type: 'input',
            name: 'roleID',
            message: `What is this employee's role ID?`,
        },
    ])
        .then((answer) => {
            db.query(`insert into employee (first_name, last_name, manager_id, role_id) values(?,?,?,?);`, [answer.fName, answer.lName, answer.managerID, answer.roleID], (err, result) => {
                resultQuery(tables[2])
            });
        })
}

// function to update an employee's role
updateEmployeeRole = () => {
    db.query(`select * from employee;`, (err, result) => {
        var employees = result
        var employeeListing = []
        var employeeIDs = {}
        for (i = 0; i < employees.length; i++) {
            let employeeName = employees[i].first_name + ' ' + employees[i].last_name
            employeeListing.push(employeeName)
            employeeIDs[employeeName] = employees[i].id
        }
        db.query(`select * from role;`, (err, result) => {
            var roles = result
            var roleListing = []
            var roleIDListing = {}
            for (i = 0; i < roles.length; i++) {
                roleListing.push(roles[i].title)
                roleIDListing[roles[i].title] = roles[i].id
            }
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'UpdatedEmployee',
                    message: 'Which employee do you wish to update?',
                    choices: employeeListing
                },
                {
                    type: 'list',
                    name: 'UpdatedRole',
                    message: 'What is their new role?',
                    choices: roleListing
                },
            ])
                .then((answer) => {
                    db.query(`update employee set role_id = ? where id =? ;`, [roleIDListing[answer.UpdatedRole], employeeIDs[answer.UpdatedEmployee]], (err, result) => {
                        resultQuery(tables[2])
                    });
                })
        })
    }
    )
}

// function to view roles table
viewAllRoles = () => {
    db.query('select title as job_title, role.id AS role_id, department.name AS department_name, salary from role JOIN department ON role.department_id = department.id;', (err, result) => {
        resultFunction(result);
    });
}

// funciton to add a role
addRoles = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: `What is this role's title?`,
        },
        {
            type: 'input',
            name: 'salary',
            message: `What is this role's salary?`,
        },
        {
            type: 'input',
            name: 'departmentID',
            message: `What is this role's department ID?`,
        },
    ])
        .then((answer) => {
            db.query(`insert into role (title, salary, department_id) values(?, ?, ?);`, [answer.title, answer.salary, answer.departmentID], (err, result) => {
                resultQuery(tables[1])
            });
        })
}

// funciton to view departments table
viewAllDepartments = () => {
    db.query('select name AS department_name, id AS department_id from department;', (err, result) => {
        resultFunction(result);
    });
}

// function to add department
addDepartments = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'Answer',
            message: 'What is this department called?',

        },
    ])
        .then((answer) => {
            db.query(`insert into department (name) values(?);`, answer.Answer, (err, result) => {
                db.query('select name AS department_name, id AS department_id from department;', (err, result) => {
                    resultFunction(result);
                });
            });
        })
}

// function to update an employee manager 
UpdateEmloyeeManager = () => {
    db.query(`select * from employee;`, (err, result) => {
        var employees = result
        var employeeListing = []
        var employeeIDs = {}
        for (i = 0; i < employees.length; i++) {
            let employeeName = employees[i].first_name + ' ' + employees[i].last_name
            employeeListing.push(employeeName)
            employeeIDs[employeeName] = employees[i].id
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'UpdatedEmployee',
                message: 'Which employee do you wish to update?',
                choices: employeeListing
            },
        ]).then((answer) => {
            // removes the chosen employee from employee listing to be used to select a manager
            employeeListing.splice(employeeListing.indexOf(answer.UpdatedEmployee), 1)
            var updatedEmployee = employeeIDs[answer.UpdatedEmployee]
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'UpdatedManager',
                    message: 'Who is their new Manager?',
                    choices: employeeListing
                },
            ]).then((answer) => {
                db.query(`update employee set manager_id = ? where id =? ;`, [employeeIDs[answer.UpdatedManager], updatedEmployee], (err, result) => {
                    resultQuery(tables[2])
                });
            })
        })
    })
}

// function to view employee's under a certain manager
ViewEmloyeebyManager = () => {
    db.query(`select m.first_name, m.last_name, m.id from employee m, employee e  
      where m.id = e.manager_id group by m.first_name;`, (err, result) => {
        var managers = result
        var managerListing = []
        var managerIDs = {}
        for (i = 0; i < managers.length; i++) {
            let managerName = managers[i].first_name + ' ' + managers[i].last_name
            managerListing.push(managerName)
            managerIDs[managerName] = managers[i].id
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager do you wish to view?',
                choices: managerListing
            },
        ]).then((answer) => {
            db.query(`select * from employee where manager_id = ?;`, managerIDs[answer.manager], (err, result) => {
                resultFunction(result);
            });
        })
    });
}

// function to view employees within a department
ViewEmployeesbyDepartment = () => {
    db.query(`select * from department;`, (err, result) => {
        var departments = result
        var departmentListing = []
        var departmentIDs = {}
        for (i = 0; i < departments.length; i++) {
            departmentListing.push(departments[i].name)
            departmentIDs[departments[i].name] = departments[i].id
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department do you wish to view employees for?',
                choices: departmentListing
            },
        ]).then((answer) => {
            db.query(`select * from employee join role on role.id = role_id join department on department.id = role.department_id where department_id = ?;`, departmentIDs[answer.department], (err, result) => {
                resultFunction(result);
            });
        })
    });
}

// function to delete role/manager/employee
Delete = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'deleteItem',
            message: 'What do you want to delete?',
            choices: tables
        },
    ]).then((answer) => {
        var deleteItem = answer.deleteItem
        if (deleteItem == 'employee') {
            db.query(`select * from employee;`,
                (err, result) => {
                    var employees = result
                    var employeeListing = []
                    var employeeIDs = {}
                    for (i = 0; i < employees.length; i++) {
                        let employeeName = employees[i].first_name + ' ' + employees[i].last_name
                        employeeListing.push(employeeName)
                        employeeIDs[employeeName] = employees[i].id
                    }
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'deletedEmployee',
                            message: 'Which employee do you wish to delete?',
                            choices: employeeListing
                        },
                    ]).then((answer) => {
                        db.query(`delete from employee where id = ?;`, employeeIDs[answer.deletedEmployee], (err, result) => {
                            resultQuery(tables[2])
                        });
                    })
                })
        } else {
            db.query(`select * from ${answer.deleteItem};`,
                (err, result) => {
                    var deleteData = result
                    var deleteVariableListing = []
                    var deleteVariableIDs = {}
                    if (deleteItem == 'role') {
                        for (i = 0; i < deleteData.length; i++) {
                            deleteVariableListing.push(deleteData[i].title)
                            deleteVariableIDs[deleteData[i].title] = deleteData[i].id
                        }
                    } else {
                        for (i = 0; i < deleteData.length; i++) {
                            deleteVariableListing.push(deleteData[i].name)
                            deleteVariableIDs[deleteData[i].name] = deleteData[i].id
                        }
                    }
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'deletedVariable',
                            message: 'Which item do you wish to delete?',
                            choices: deleteVariableListing
                        },
                    ]).then((answer) => {
                        db.query(`delete from ${deleteItem} where id = ${deleteVariableIDs[answer.deletedVariable]};`, (err, result) => {
                            resultQuery(deleteItem)
                        })
                    })
                });
        }
    })
}

// view sum of all salaries per a department
ViewBudget = () => {
    db.query(`select name as department_id, sum(salary) as total_salary from department  join role on department.id = role.department_id group by name;`, (err, result) => {
        resultFunction(result);
    })
}

// inquirer function to prompt user for responses.
function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'Answer',
            message: 'What would you like to do',
            choices: intialChoices
        },
    ])
        .then((answers) => {
            switch (answers.Answer) {
                case intialChoices[0]: viewAllEmployees();
                    break;
                case intialChoices[1]: addEmployees();
                    break;
                case intialChoices[2]: updateEmployeeRole();
                    break;
                case intialChoices[3]: viewAllRoles();
                    break;
                case intialChoices[4]: addRoles();
                    break;
                case intialChoices[5]: viewAllDepartments();
                    break;
                case intialChoices[6]: addDepartments();
                    break;
                case intialChoices[7]: UpdateEmloyeeManager();
                    break;
                case intialChoices[8]: ViewEmloyeebyManager();
                    break;
                case intialChoices[9]: ViewEmployeesbyDepartment();
                    break;
                case intialChoices[10]: Delete();
                    break;
                case intialChoices[11]: ViewBudget();
                    break;
                case intialChoices[12]: exit();
                    break;
            }
        });
}

init()