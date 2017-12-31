let mysql_connect = require('../../util/mysql_connect');

let controller = {};

// get all department
controller.getAllDepartments = async function () {
  let departmentsRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT * FROM department;';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select all departments: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return departmentsRes;
}
// update department
controller.updateDepartment = async function (id, name, code) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let updateSql = 'UPDATE department SET name=\'' + name + '\', code=\'' + code + '\' WHERE id=' + id + ';';
      // console.log(insertSql);
      connection.query(updateSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update department: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      console.log(JSON.stringify(err));
      resolve('update error');
    }
  });
  return updateRes;
}
// insert department
controller.insertDepartment = async function (name, code) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let updateSql = 'INSERT INTO department (name, code) VALUES (\'' + name + '\', \'' + code + '\');';
      // console.log(insertSql);
      connection.query(updateSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert department: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      console.log(JSON.stringify(err));
      resolve('insert error');
    }
  });
  return insertRes;
}
// delete department
controller.deleteDepartmentByID = async function (id) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let deleteSql = 'DELETE FROM department WHERE id=' + id + ';';
      connection.query(deleteSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete department: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('delete error');
    }
  });
  return deleteRes;
}

module.exports = controller;