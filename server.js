
// Import and require mysql2
const mysql = require('mysql2');
const path = require('path');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { Model, DataTypes } = require('sequelize');
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
    "Add Role", "View All Departments", "Add Department"]

viewAllEmployees = () => {
    db.query(`select e.id as employee_id, e.first_name, e.last_name, title, name as department_name, 
    salary, m.first_name as manager_first_name, m.last_name as manager_first_name from employee e, employee m  
    JOIN role on role_id = role.id join department 
    ON role.department_id = department.id where e.manager_id = m.id;`, (err, result) => {
        console.table(result)
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
            console.log(answer.Answer)
            db.query(`insert into employee (first_name, last_name, manager_id, role_id) values('${answer.fName}', '${answer.lName}', ${answer.managerID}, ${answer.roleID});`, (err, result) => {
                db.query('select * from employee;', (err, result) => {
                    console.table(result)
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
                    console.table(result)
                });
            });
            init()
        })
}

viewAllRoles = () => {
    db.query('select title as job_title, role.id AS role_id, department.name AS department_name, salary from role JOIN department ON role.department_id = department.id;', (err, result) => {
        console.table(result)
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
            console.log(answer.Answer)
            db.query(`insert into role (title, salary, department_id) values('${answer.title}', ${answer.salary}, ${answer.departmentID});`, (err, result) => {
                db.query('select * from role;', (err, result) => {
                    console.table(result)
                });
            });
            init()
        })
}

viewAllDepartments = () => {
    db.query('select name AS department_name, id AS department_id from department;', (err, result) => {
        console.table(result)
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
                    console.table(result)
                });
            });
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


            }
        });
}

init()