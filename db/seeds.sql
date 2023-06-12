--seeds for department
INSERT INTO department (name)
    VALUES  ('Business strategy'),
            ('Marketing'),
            ('Operations'),
            ('Finance'),
            ('Sales'),
            ('Engineering'),
            ('Human Resources'),
            ('Information Technology');

--seeds for role
INSERT INTO role (title, salary, department_id)
    VALUES  ('Marketing Manager', 70000.00, 2),
            ('Junior Software Engineer', 50000.00, 6),
            ('Accountant', 65000.00, 4),
            ('Recruiter', 60000.00, 7),
            ('Systems Administrator', 70000.00, 8),
            ('Sales Representative', 30000.00, 5),
            ('Director of Operations', 100000.00, 3),
            ('Business Strategist', 75000.00, 1);
        
--seeds for employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES  ('Jeanne', 'Mertle', 1, null),
            ('Andy', 'Robinson', 2, 1),
            ('Cami', 'Williams', 3, 2),
            ('Heather', 'Thomas', 4, 3),
            ('Todd', 'Web', 5, null),
            ('Nathan', 'Barret', 6, 4),
            ('Elinor', 'Perez', 7, null),
            ('Casey', 'Smith', 8, 7);
        