-- DROP DATABASE IF EXISTS employees;
-- CREATE DATABASE employees;
-- USE employees;
-- DROP TABLE IF EXISTS employee;
-- DROP TABLE IF EXISTS role;
-- DROP TABLE IF EXISTS department;


-- CREATE TABLE department (
--   id INTEGER PRIMARY KEY AUTO_INCREMENT,
--   name VARCHAR(30) NOT NULL
-- );


-- CREATE TABLE role (
--     id INTEGER PRIMARY KEY AUTO_INCREMENT,
--     title VARCHAR(30) NOT NULL, 
--     salary DECIMAL(16,2) NOT NULL,
--     department_id INTEGER, 
--     CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL 
-- );


-- CREATE TABLE employee (
--   id INTEGER PRIMARY KEY AUTO_INCREMENT,
--   first_name VARCHAR(30) NOT NULL,
--   last_name VARCHAR(30) NOT NULL,
--   role_id INTEGER,
--   manager_id INTEGER,
--   CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
--   CONSTRAINT fk_employee FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
-- );



DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
