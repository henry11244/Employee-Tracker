INSERT INTO department (name)
VALUES ('Finance'),
       ('Engineer'),
       ('Human Resources'),
       ('Marketing'),
       ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES ("President of everything!!!", 500000, 5),
        ("Finance Manager", 150000, 1),
       ("Senior Accountant", 120000, 1),
       ("Lead Engineer", 200000, 2),
       ("Engineer", 150000, 2),
       ("Developer", 120000, 2),
       ("Marketing Manager", 130000, 4),
       ("Recruiter", 90000, 3);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Douglas (Dr. Evil)", "Powers", null, 1),
        ("Finance", "Person", 1, 2),
       ("James","Bond", 2, 3),
       ("Mark", "Zuckerberg", 1, 4),
       ("Elon", "Musk", 4, 5),
       ("Newbie","Developer", 4, 6),
       ("The Best", "Marketer", 1, 7),
       ("Robert", "Half", 8, 1);
           