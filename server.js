
// Import and require mysql2
const mysql = require('mysql2');
const path = require('path');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { Model, DataTypes } = require('sequelize');
const { exit } = require('process');
class employee extends Model { }

const PORT = process.env.PORT || 3001;


// Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

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

const intialChoices = ["Veiw All Employees", "Add Employee", "Updated Employee Role", "View All Roles",
    "Add Role", "View All Departments", "Add Department", "Update an Employee Manager",
    "View Emloyee by Manager", "View Employees by Department", "Delete Department, Role or Employee", "View Total Department Budget", "Exit"]

viewAllEmployees = () => {
    db.query(`select e.id as employee_id, e.first_name, e.last_name, title, name as department_name, 
    salary, m.first_name as manager_first_name, m.last_name as manager_last_name from employee m, employee e  
    JOIN role on role_id = role.id join department 
    ON role.department_id = department.id where m.id = e.manager_id;`, (err, result) => {
        console.log("\n");
        console.table(result);
        console.log("\n");
    });
    init()
}

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
            db.query(`insert into employee (first_name, last_name, manager_id, role_id) values('${answer.fName}', '${answer.lName}', ${answer.managerID}, ${answer.roleID});`, (err, result) => {
                db.query('select * from employee;', (err, result) => {
                    console.log("\n");
                    console.table(result)
                    console.log("\n");
                });
            });
            init()
        })
}

updatedEmployeeRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeID',
            message: `What is the ID of the employee you wish to update?`,

        },
        {
            type: 'input',
            name: 'newRoleID',
            message: `What is the new role ID for this employee?`,

        },
    ])
        .then((answer) => {
            db.query(`update employee set role_id = ${answer.newRoleID} where id =${answer.employeeID} ;`, (err, result) => {
                db.query('select * from employee;', (err, result) => {
                    console.log("\n");
                    console.table(result)
                    console.log("\n");
                });
            });
            init()
        })
}

updatedEmployeeRole = () => {
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
                    db.query(`update employee set role_id = ${roleIDListing[answer.UpdatedRole]} where id =${employeeIDs[answer.UpdatedEmployee]} ;`, (err, result) => {
                        db.query('select * from employee;', (err, result) => {
                            console.log("\n");
                            console.table(result);
                            console.log("\n");
                        });
                    });
                    init()
                })
        })
    }
    )
}



viewAllRoles = () => {
    db.query('select title as job_title, role.id AS role_id, department.name AS department_name, salary from role JOIN department ON role.department_id = department.id;', (err, result) => {
        console.log("\n");
        console.table(result);
        console.log("\n");
    });
    init()
}

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
            db.query(`insert into role (title, salary, department_id) values('${answer.title}', ${answer.salary}, ${answer.departmentID});`, (err, result) => {
                db.query('select * from role;', (err, result) => {
                    console.log("\n");
                    console.table(result);
                    console.log("\n");
                });
            });
            init()
        })
}

viewAllDepartments = () => {
    db.query('select name AS department_name, id AS department_id from department;', (err, result) => {
        console.log("\n");
        console.table(result);
        console.log("\n");
    });
    init()
}

addDepartments = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'Answer',
            message: 'What is this department called?',

        },
    ])
        .then((answer) => {
            console.log(answer.Answer)
            db.query(`insert into department (name) values('${answer.Answer}');`, (err, result) => {
                db.query('select name AS department_name, id AS department_id from department;', (err, result) => {
                    console.log("\n");
                    console.table(result)
                    console.log("\n");
                });
            });
            init()
        })

}

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
                db.query(`update employee set manager_id = ${employeeIDs[answer.UpdatedManager]} where id =${updatedEmployee} ;`, (err, result) => {
                    db.query('select * from employee;', (err, result) => {
                        console.log("\n");
                        console.table(result);
                        console.log("\n");
                    });
                });
                init()
            })
        })
    })
}



ViewEmloyeebyManager = () => { }

ViewEmployeesbyDepartment = () => { }

Delete = () => { }

ViewBudget = () => {
    db.query(`select name as department_id, sum(salary) as total_salary from department  join role on department.id = role.department_id group by name;`, (err, result) => {
        console.log("\n");
        console.table(result);
        console.log("\n");
        init()
    })
}



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
            //     console.log(answers.Answer);
            //     console.log(intialChoices[0]);

            switch (answers.Answer) {
                case intialChoices[0]: viewAllEmployees();
                    break;
                case intialChoices[1]: addEmployees();
                    break;
                case intialChoices[2]: updatedEmployeeRole();
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
                case intialChoices[8]: return;
                    break;
                case intialChoices[9]: return;
                    break;
                case intialChoices[10]: return;
                    break;
                case intialChoices[11]: ViewBudget();
                    break;
                case intialChoices[12]: exit();
                    break;

            }
        });
}

init()