let mysql_connect = require('../../util/mysql_connect');
let controller = {};

let filterEmployeeRight = function (employee_with_right) {
  let tempEmployee = {};
  tempEmployee.id = employee_with_right.id;
  tempEmployee.name = employee_with_right.name;
  tempEmployee.password = employee_with_right.password;
  if (employee_with_right.administrator_id !== null) {
    tempEmployee.adminRight = true;
  } else if (employee_with_right.personnel_id !== null) {
    tempEmployee.personnelRight = true;
  } else if (employee_with_right.head_department_id !== null) {
    tempEmployee.headRight = true;
    tempEmployee.department = {
      id: employee_with_right.head_department_id,
      name: employee_with_right.head_department_name,
      code: employee_with_right.head_department_code
    };
  } else if (employee_with_right.belong_department_id !== null) {
    tempEmployee.department = {
      id: employee_with_right.belong_department_id,
      name: employee_with_right.belong_department_name,
      code: employee_with_right.belong_department_code
    };
  }
  return tempEmployee;
}

controller.getEmployeeByID = async function (employee_id) {
  return new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT * FROM employee WHERE id=' + employee_id;
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('get employee: ' + JSON.stringify(results));
          if (results.length === 1) {
            // return department: id, name, code
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve(null);
    }
  });
}

controller.updateEmployee = async function (employee) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let updateSql = 'UPDATE employee SET name=\'' + employee.name + '\', password=\'' + employee.password + '\' WHERE id=' + employee.id;
      connection.query(updateSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update employee: ' + JSON.stringify(results));
          if (results.affectedRows === 1) {
            resolve('update success');
          } else {
            resolve('update fail');
          }
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('update error');
    }
  });
  return updateRes;
}

controller.insertEmployee = async function (employee) {
  if (typeof employee.name === 'string' && typeof employee.password === 'string' && employee.name !== null && employee.password !== null) {
    let insertRes = await new Promise((resolve, reject) => {
      try {
        let connection = mysql_connect();
        connection.connect();
        console.log('oepn connection');
        let insertSql = 'INSERT INTO employee (name, password) VALUES (\'' + employee.name + '\', \'' + employee.password + '\');';
        connection.query(insertSql, function (err, results, fileds) {
          if (err) {
            console.log(JSON.stringify(err));
            resolve(err);
          } else {
            console.log('insert employee: ' + JSON.stringify(results));
            resolve(results);
          }
        });
        console.log('close connection');
        connection.end();
      } catch (err) {
        resolve('insert error');
      }
    });
    return insertRes;
  } else {
    return 'format error';
  }
}

controller.deleteEmployeeByID = async function (employee_id) {
  return new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'DELETE FROM employee WHERE id=' + employee_id;
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('get employee: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve(null);
    }
  });
}

controller.getEmployeeIDsByBelongDepartmentID = async function (department_id) {
  return new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT * FROM employee_belong_department WHERE department_id=' + department_id + ';';
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('get employee_belong_department department_id: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve(null);
    }
  });
}

controller.getAllIdentity = async function () {
  let allEmployees = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT\n' +
        '  employee.id       AS id,\n' +
        '  employee.name     AS name,\n' +
        '  employee.password AS password,\n' +
        '  admin.employee_id AS administrator_id,\n' +
        '  personnel.employee_id AS personnel_id,\n' +
        '  d1.id AS belong_department_id,\n' +
        '  d1.name AS belong_department_name,\n' +
        '  d1.code AS belong_department_code,\n' +
        '  d2.id AS head_department_id,\n' +
        '  d2.name AS head_department_name,\n' +
        '  d2.code AS head_department_code\n' +
        'FROM (employee\n' +
        '  LEFT JOIN employee_administrator admin ON employee.id = admin.employee_id\n' +
        '  LEFT JOIN employee_personnel personnel ON employee.id = personnel.employee_id\n' +
        '  LEFT JOIN (employee_belong_department ebd INNER JOIN department d1 ON ebd.department_id = d1.id)\n' +
        '    ON employee.id = ebd.employee_id\n' +
        '  LEFT JOIN (employee_head_department ehd INNER JOIN department d2 ON ehd.department_id = d2.id)\n' +
        '    ON employee.id = ehd.employee_id);\n';
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('get all employees: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve(null);
    }
  });
  let resEmployees = [];
  for (let index in allEmployees) {
    let tempEmployee = filterEmployeeRight(allEmployees[index]);
    resEmployees.push(tempEmployee);
  }
  return resEmployees;
}

controller.getAllIdentityByDepartment = async function (department_id) {
  let allEmployees = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT\n' +
        '  employee.id       AS id,\n' +
        '  employee.name     AS name,\n' +
        '  employee.password AS password,\n' +
        '  admin.employee_id AS administrator_id,\n' +
        '  personnel.employee_id AS personnel_id,\n' +
        '  d1.id AS belong_department_id,\n' +
        '  d1.name AS belong_department_name,\n' +
        '  d1.code AS belong_department_code,\n' +
        '  d2.id AS head_department_id,\n' +
        '  d2.name AS head_department_name,\n' +
        '  d2.code AS head_department_code\n' +
        'FROM (employee\n' +
        '  LEFT JOIN employee_administrator admin ON employee.id = admin.employee_id\n' +
        '  LEFT JOIN employee_personnel personnel ON employee.id = personnel.employee_id\n' +
        '  LEFT JOIN (employee_belong_department ebd INNER JOIN department d1 ON ebd.department_id = d1.id)\n' +
        '    ON employee.id = ebd.employee_id\n' +
        '  LEFT JOIN (employee_head_department ehd INNER JOIN department d2 ON ehd.department_id = d2.id)\n' +
        '    ON employee.id = ehd.employee_id) WHERE d1.id=' + department_id + ' OR d2.id=' + department_id + ';';
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('get all employees: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve(null);
    }
  });
  let resEmployees = [];
  for (let index in allEmployees) {
    let tempEmployee = filterEmployeeRight(allEmployees[index]);
    resEmployees.push(tempEmployee);
  }
  return resEmployees;
}

controller.getIdentityByID = async function (employee_id) {
  let employee = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT\n' +
        '  employee.id       AS id,\n' +
        '  employee.name     AS name,\n' +
        '  employee.password AS password,\n' +
        '  admin.employee_id AS administrator_id,\n' +
        '  personnel.employee_id AS personnel_id,\n' +
        '  d1.id AS belong_department_id,\n' +
        '  d1.name AS belong_department_name,\n' +
        '  d1.code AS belong_department_code,\n' +
        '  d2.id AS head_department_id,\n' +
        '  d2.name AS head_department_name,\n' +
        '  d2.code AS head_department_code\n' +
        'FROM (employee\n' +
        '  LEFT JOIN employee_administrator admin ON employee.id = admin.employee_id\n' +
        '  LEFT JOIN employee_personnel personnel ON employee.id = personnel.employee_id\n' +
        '  LEFT JOIN (employee_belong_department ebd INNER JOIN department d1 ON ebd.department_id = d1.id)\n' +
        '    ON employee.id = ebd.employee_id\n' +
        '  LEFT JOIN (employee_head_department ehd INNER JOIN department d2 ON ehd.department_id = d2.id)\n' +
        '    ON employee.id = ehd.employee_id) WHERE employee.id=' + employee_id;
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('get id: ' + employee_id + ' employee: ' + JSON.stringify(results));
          if (results.length === 1) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve(null);
    }
  });
  let tempEmployee = filterEmployeeRight(employee);
  return tempEmployee;
}

controller.getIdentityByName = async function (employee_name) {
  let employees = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT\n' +
        '  employee.id       AS id,\n' +
        '  employee.name     AS name,\n' +
        '  employee.password AS password,\n' +
        '  admin.employee_id AS administrator_id,\n' +
        '  personnel.employee_id AS personnel_id,\n' +
        '  d1.id AS belong_department_id,\n' +
        '  d1.name AS belong_department_name,\n' +
        '  d1.code AS belong_department_code,\n' +
        '  d2.id AS head_department_id,\n' +
        '  d2.name AS head_department_name,\n' +
        '  d2.code AS head_department_code\n' +
        'FROM (employee\n' +
        '  LEFT JOIN employee_administrator admin ON employee.id = admin.employee_id\n' +
        '  LEFT JOIN employee_personnel personnel ON employee.id = personnel.employee_id\n' +
        '  LEFT JOIN (employee_belong_department ebd INNER JOIN department d1 ON ebd.department_id = d1.id)\n' +
        '    ON employee.id = ebd.employee_id\n' +
        '  LEFT JOIN (employee_head_department ehd INNER JOIN department d2 ON ehd.department_id = d2.id)\n' +
        '    ON employee.id = ehd.employee_id) WHERE employee.name=\'' + employee_name + '\';';
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('get employee_name: ' + employee_name + ' employee: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve(null);
    }
  });
  let resEmployees = [];
  for (let index in employees) {
    let tempEmployee = filterEmployeeRight(employees[index]);
    resEmployees.push(tempEmployee);
  }
  return resEmployees;
}

controller.getIdentityByDepartment = async function (department_id) {
  let allEmployees = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT\n' +
        '  employee.id       AS id,\n' +
        '  employee.name     AS name,\n' +
        '  employee.password AS password,\n' +
        '  admin.employee_id AS administrator_id,\n' +
        '  personnel.employee_id AS personnel_id,\n' +
        '  d1.id AS belong_department_id,\n' +
        '  d1.name AS belong_department_name,\n' +
        '  d1.code AS belong_department_code,\n' +
        '  d2.id AS head_department_id,\n' +
        '  d2.name AS head_department_name,\n' +
        '  d2.code AS head_department_code\n' +
        'FROM (employee\n' +
        '  LEFT JOIN employee_administrator admin ON employee.id = admin.employee_id)\n' +
        '  LEFT JOIN employee_personnel personnel ON employee.id = personnel.employee_id\n' +
        '  LEFT JOIN (employee_belong_department ebd INNER JOIN department d1 ON ebd.department_id = d1.id)\n' +
        '    ON employee.id = ebd.employee_id\n' +
        '  LEFT JOIN (employee_head_department ehd INNER JOIN department d2 ON ehd.department_id = d2.id)\n' +
        '    ON employee.id = ehd.employee_id WHERE d1.id=' + department_id + ';';
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('get department id: ' + department_id + ' employees: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve(null);
    }
  });
  let resEmployees = [];
  for (let index in allEmployees) {
    let tempEmployee = filterEmployeeRight(allEmployees[index]);
    resEmployees.push(tempEmployee);
  }
  return resEmployees;
}

controller.checkIdentity = async function (user) {
  let positiveReg = /^[0-9]+$/;
  user.id = Number(user.id);
  if (typeof user.id === 'number' && positiveReg.test(user.id) && typeof user.password === 'string') {
    let resUser = await this.getEmployeeByID(user.id);
    if (resUser.password === user.password) {
      // login success
      resUser = await this.getIdentityByID(resUser.id);
      // the rest user
      return resUser;
    } else {
      // login failed
      return 'password error';
    }
  } else {
    return 'format error';
  }
}


module.exports = controller;