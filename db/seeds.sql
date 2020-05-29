INSERT INTO department (id, name)
VALUES
    (1, 'G&A'),
    (2, 'Professional Services'),
    (3, 'Marketing'),
    (4, 'HR')
    ;

INSERT INTO role (title, salary, department_id)
VALUES
  ('VP', '250000', 1),
  ('SVP', '220000', 2),
  ('Director', '200000', 3),
  ('Manager', '180000', 4)
  ;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('James', 'Fraser', 1, 1),
  ('Jack', 'London', 2, 2),
  ('Robert', 'Bruce', 3, 1),
  ('Arnold', 'Bennett', 4, 3)
;




