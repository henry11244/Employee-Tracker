const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const path = require('path');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
    console.log(`Connected to the e,[;puees_db database.`)
);

const intialChoices = ["Veiw All Employees", "Add Employee", "Updated Employee Role", "View All Roles",
    "Add Role", "View All Departments", "Add Department"]

viewAllEmployees = () => { }

addEmployees = () => { }

updatedEmployeeRole = () => { }

viewAllRoles = () => { }

addRoles = () => { }

viewAllDepartments = () => { }

addDepartments = () => { }

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
                case intialChoices[0]: console.log("test1");
                    break;
                case intialChoices[1]: console.log("test2");
                    break;
                case intialChoices[2]: console.log("test3");
                    break;
                case intialChoices[3]: console.log("test4");
                    break;
                case intialChoices[4]: console.log("test5");
                    break;
                case intialChoices[5]: console.log("test6");
                    break;
                case intialChoices[6]: console.log("tes7");


            }
        });
}

init()