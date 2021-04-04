CREATE DATABASE empdebt;

CREATE TABLE dept(
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(20) NOT NULL,
    dept_count INT DEFAULT 0
);

CREATE TABLE emp(
    emp_id SERIAL PRIMARY KEY,
    emp_age INT,
    emp_name VARCHAR(60) NOT NULL,
    emp_gender VARCHAR(6) NOT NULL,
    emp_deptid INT REFERENCES dept(dept_id),
    emp_location VARCHAR(20) NOT NULL,
    emp_doj DATE NOT NULL DEFAULT CURRENT_DATE
);









create or replace function update_count() 
  returns trigger  
as $func$
begin
    update dept 
       set dept_count = dept_count+1
    FROM emp
     where dept_id = emp.emp_deptid;
    return NULL;
end;
$func$ language plpgsql;




create trigger inc_counter
       after insert on emp
       execute procedure update_count();



