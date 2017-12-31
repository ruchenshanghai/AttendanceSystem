let mysql_connect = require('../../util/mysql_connect');

let controller = {};

controller.assignEmployeeToDepartment = async function (employee_id, department_id) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_belong_department (employee_id, department_id) VALUES (' + employee_id + ', ' + department_id + ');';
      // console.log(insertSql);
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee_belong_department: ' + JSON.stringify(results));
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
}

let dismissEmployeeBelongTo = async function (employee_id) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'DELETE FROM employee_belong_department WHERE employee_id=' + employee_id + ';';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_belong_department: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('insert error');
    }
  });
  return deleteRes;
}

controller.assignHeadToDepartment = async function (employee_id, department_id) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_head_department (employee_id, department_id) VALUES (' + employee_id + ', ' + department_id + ');';
      // console.log(insertSql);
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee_head_department: ' + JSON.stringify(results));
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
}

let dismissEmployeeHead = async function (employee_id) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'DELETE FROM employee_head_department WHERE employee_id=' + employee_id + ';';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_head_department: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('insert error');
    }
  });
  return deleteRes;
}

controller.assignPersonnel = async function (employee_id) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_personnel (employee_id) VALUES (' + employee_id + ');';
      // console.log(insertSql);
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee_personnel: ' + JSON.stringify(results));
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
}

let dismissEmployeePersonnel = async function (employee_id) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'DELETE FROM employee_personnel WHERE employee_id=' + employee_id + ';';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_personnel: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('insert error');
    }
  });
  return deleteRes;
}

controller.assignAdministrator = async function (employee_id) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_administrator (employee_id) VALUES (' + employee_id + ');';
      // console.log(insertSql);
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee_personnel: ' + JSON.stringify(results));
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
}

let dismissEmployeeAdministrator = async function (employee_id) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'DELETE FROM employee_administrator WHERE employee_id=' + employee_id + ';';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_administrator: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('insert error');
    }
  });
  return deleteRes;
}

controller.dismissEmployeeByAdministrator = async function (employee) {
  let dismissRes = {};
  if (employee.adminRight) {
    dismissRes = await dismissEmployeeAdministrator(employee.id);
  } else if (employee.personnelRight) {
    dismissRes = await dismissEmployeePersonnel(employee.id);
  } else if (employee.headRight) {
    dismissRes = await dismissEmployeeHead(employee.id);
  } else if (employee.department !== undefined) {
    dismissRes = await dismissEmployeeBelongTo(employee.id);
  }
  return dismissRes;
}

controller.dismissEmployeeByPersonnel = async function (employee) {
  let dismissRes = {};
  if (employee.adminRight) {
    dismissRes = false;
  } else if (employee.personnelRight) {
    dismissRes = false;
  } else if (employee.headRight) {
    dismissRes = await dismissEmployeeHead(employee.id);
  } else if (employee.department !== undefined) {
    dismissRes = await dismissEmployeeBelongTo(employee.id);
  }
  return dismissRes;
}

module.exports = controller;