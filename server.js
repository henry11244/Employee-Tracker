
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

addEmployees = () => { }

updatedEmployeeRole = () => { }

viewAllRoles = () => {
    db.query('select title as job_title, role.id AS role_id, department.name AS department_name, salary from role JOIN department ON role.department_id = department.id;', (err, result) => {
        console.table(result)
    });
    init()
}

addRoles = () => { }

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
                case intialChoices[1]: console.log("test2");
                    break;
                case intialChoices[2]: console.log("test3");
                    break;
                case intialChoices[3]: viewAllRoles();
                    break;
                case intialChoices[4]: console.log("test5");
                    break;
                case intialChoices[5]: viewAllDepartments();
                    break;
                case intialChoices[6]: addDepartments();


            }
        });
}

init()