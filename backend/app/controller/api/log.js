const moment = require('moment');
let mysql_connect = require('../../util/mysql_connect');


let controller = {};
// insert log format: employee_id, operate_type, operate_value, only for server
controller.insertLog = async function (employee_id, operate_type, operate_value) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let create_time = moment().format('YYYY-MM-DD HH:mm:ss');
      let update_time = create_time;
      let insertSql = 'INSERT INTO log (employee_id, operate_type, operate_value, create_time, update_time) VALUES (' + employee_id + ', \'' + operate_type + '\', N\'' + operate_value + '\', \'' + create_time + '\', \'' + update_time + '\');';
      // console.log(insertSql);
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert log: ' + JSON.stringify(results));
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
// update log format: id, employee_id, operate_type, operate_value, only for admin
controller.updateLog = async function (id, employee_id, operate_type, operate_value) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
      let updateSql = 'UPDATE log SET employee_id=' + id + ', operate_type=\'' + operate_type + '\', operate_value=\'' + operate_value + '\', update_time=\'' + update_time + '\' WHERE id=' + id + ';';
      // console.log(insertSql);
      connection.query(updateSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update log: ' + JSON.stringify(results));
          resolve(results);
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
// delete log format: id array
controller.deleteLogs = async function (targetArray) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let deleteSql = 'DELETE FROM log WHERE id IN (' + targetArray.toString() + ');';
      connection.query(deleteSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete log: ' + JSON.stringify(results));
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
// get all log
controller.getAllLogs = async function () {
  let logsRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT * FROM log;';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select all logs: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return logsRes;
}

module.exports = controller;