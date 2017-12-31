Sub project for nodejs server, support api interface to manipulate mysql db.
database(MySQL) config: host: 118.89.184.85, port: 3306, username: attendance, password: database2017, database: attendance.

E-R Model:
Identity:
1.employee:
three roles: general employee, department head and personnel manager;
attributes: id, name, password;
primary key: id.

2.department:
attributes: id, name, code;
primary key: id; name and code both are unique and not null.

3.employee_belongs_department(relationship):
attributes: employee_id, department_id;
primary_key:  (employee_id, department_id).

4.employee_head_department(relationship):
attributes: employee_id, department_id;
primary_key:  (employee_id, department_id).

5.employee_personnel:
attributes: employee_id, unique, not contained in 3 and 4.

6.employee_administrator:
attributes: employee_id, unique, not contained in 3 and 4.

一个员工作为普通员工只能归属一个部门，作为部门主管只能管理一个部门，一个部门只能有一个部门主管。

Business:
1.employee_check:
attributes: id, employee_id, check_type, check_time, check_status;
primary key: id; reference key: employee_id.

2.trip_application:
attributes: id, employee_id, trip_type_id, begin_time, end_time, reason, status;
primary key: id; reference key: employee_id, trip_type_id.

3.trip_type:
attributes: id, name;
primary key: id.

4.leave_application:
attributes: id, employee_id, leave_type_id, begin_time, end_time, reason, status;
primary key: id; reference key: employee_id, leave_type_id.
5.leave_type:
attributes: id, name;
primary key: id.

Log:(纵表)
atributes: ID, employee_id, operate_type, operate_value

