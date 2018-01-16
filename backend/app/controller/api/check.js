const moment = require('moment');
let mysql_connect = require('../../util/mysql_connect');

let setting_controller = require('./setting');
let employee_controller = require('./employee');



let isCheckInStatusLegal = async function (check_in_time) {
  let standard_check_in_time = await setting_controller.getValueByName(setting_controller.CHECK_IN_NAME);
  let standard_check_out_time = await setting_controller.getValueByName(setting_controller.CHECK_OUT_NAME);
  if (standard_check_in_time.value !== undefined && standard_check_out_time.value !== undefined) {
    standard_check_in_time = standard_check_in_time.value;
    standard_check_out_time = standard_check_out_time.value;
    if (check_in_time <= standard_check_in_time) {
      return true;
    } else if (check_in_time > standard_check_in_time && check_in_time < standard_check_out_time) {
      return false;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

let isCheckOutStatusLegal = async function (check_out_time) {
  let standard_check_in_time = await setting_controller.getValueByName(setting_controller.CHECK_IN_NAME);
  let standard_check_out_time = await setting_controller.getValueByName(setting_controller.CHECK_OUT_NAME);
  if (standard_check_in_time.value !== undefined && standard_check_out_time.value !== undefined) {
    standard_check_in_time = standard_check_in_time.value;
    standard_check_out_time = standard_check_out_time.value;
    if (standard_check_out_time <= check_out_time) {
      return true;
    } else if (check_out_time > standard_check_in_time && check_out_time < standard_check_out_time) {
      return false;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

let insertCheckIn = async function (employee_id, check_date, check_time, check_status) {
  let insertRes = await new Promise((resolve, reject) => {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
    let insertSql = 'INSERT INTO employee_check (employee_id, check_date, check_in_time, check_in_status) VALUES (' + employee_id + ', \'' + check_date + '\', \'' + check_time + '\', ' + check_status + ');';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert check in, employee_id: ' + employee_id + ', check_date: ' + check_date + ', check_time: ' + check_time + ', res: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
  });
  return insertRes;
}

let updateCheckOut = async function (employee_id, check_date, check_time, check_status) {
  let updateRes = await new Promise((resolve, reject) => {
    let connection = mysql_connect();
    connection.connect();
    console.log('oepn connection');
    let insertSql = 'UPDATE employee_check SET check_out_time=\'' + check_time + '\', check_out_status=' + check_status + ' WHERE employee_id=' + employee_id + ' AND check_date=\'' + check_date + '\' AND check_in_time IS NOT NULL AND check_out_time IS NULL;';
    connection.query(insertSql, function (err, results, fileds) {
      if (err) {
        console.log(JSON.stringify(err));
        resolve(err);
      } else {
        console.log('insert check out, employee_id: ' + employee_id + ', check_date: ' + check_date + ', check_time: ' + check_time + ', res: ' + JSON.stringify(results));
        resolve(results);
      }
    });
    console.log('close connection');
    connection.end();
  });
  return updateRes;
}


let controller = {};
// ok
controller.checkIn = async function (employee_id) {
  let check_datetime = moment().format('YYYY-MM-DD HH:mm:ss');
  let check_date = moment(check_datetime).format('YYYY-MM-DD');
  let check_time = moment(check_datetime).format('HH:mm:ss');
  // check if the date need work
  if (new Date(check_date).getDay() % 6 == 0) {
    // weekend
    return {
      check_status: 'date error'
    }
  }
  let check_status = await isCheckInStatusLegal(check_time);
  if (check_status === null) {
    return 'time error';
  } else {
    let insertRes = await insertCheckIn(employee_id, check_date, check_time, check_status);
    return insertRes;
  }
}
// ok
controller.checkInSpecifiedDatetime = async function (employee_id, datetime) {
  let check_datetime = moment(datetime).format('YYYY-MM-DD HH:mm:ss');
  let check_date = moment(check_datetime).format('YYYY-MM-DD');
  let check_time = moment(check_datetime).format('HH:mm:ss');

  // check if the date need work
  if (new Date(check_date).getDay() % 6 == 0) {
    // weekend
    return {
      check_status: 'date error'
    }
  }
  let check_status = await isCheckInStatusLegal(check_time);
  if (check_status === null) {
    return 'time error';
  } else {
    let insertRes = await insertCheckIn(employee_id, check_date, check_time, check_status);
    return insertRes;
  }
}

// ok
controller.checkOut = async function (employee_id) {
  let check_datetime = moment().format('YYYY-MM-DD HH:mm:ss');
  let check_date = moment(check_datetime).format('YYYY-MM-DD');
  let check_time = moment(check_datetime).format('HH:mm:ss');
  // check if the date need work
  if (new Date(check_date).getDay() % 6 == 0) {
    // weekend
    return {
      check_status: 'date error'
    }
  }
  let check_status = await isCheckOutStatusLegal(check_time);
  if (check_status === null) {
    return 'time error';
  } else {
    let insertRes = await updateCheckOut(employee_id, check_date, check_time, check_status);
    return insertRes;
  }
}
// ok
controller.checkOutSpecifiedDatetime = async function (employee_id, datetime) {
  let check_datetime = moment(datetime).format('YYYY-MM-DD HH:mm:ss');
  let check_date = moment(check_datetime).format('YYYY-MM-DD');
  let check_time = moment(check_datetime).format('HH:mm:ss');

  // check if the date need work
  if (new Date(check_date).getDay() % 6 == 0) {
    // weekend
    return {
      check_status: 'date error'
    }
  }
  let check_status = await isCheckOutStatusLegal(check_time);
  if (check_status === null) {
    return 'time error';
  } else {
    let updateRes = await updateCheckOut(employee_id, check_date, check_time, check_status);
    return updateRes;
  }
}

// admin ok
controller.updateCheck = async function (employee_check_id, employee_id, check_in_datetime, check_in_status, check_out_datetime, check_out_status) {
  // UPDATE employee_check SET employee_id=4, check_date='2017-12-29', check_in_time='12:00:00', check_in_status=TRUE, check_out_time='20:00:00', check_out_status=FALSE WHERE id=3;
  let check_date = moment(check_in_datetime).format('YYYY-MM-DD');
  if (check_date !== moment(check_out_datetime).format('YYYY-MM-DD')) {
    return 'datetime error';
  } else {
    let check_in_time = moment(check_in_datetime).format('HH:mm:ss');
    let check_out_time = moment(check_out_datetime).format('HH:mm:ss');
    let updateRes = await new Promise((resolve, reject) => {
      try {
        let connection = mysql_connect();
        connection.connect();
        console.log('oepn connection');
        let updateSql = 'UPDATE employee_check SET employee_id=' + employee_id + ', check_date=\'' + check_date + '\', check_in_time=\'' + check_in_time + '\', check_in_status=' + check_in_status + ', check_out_time=\'' + check_out_time + '\', check_out_status=' + check_out_status + ' WHERE id=' + employee_check_id + ';';
        console.log(updateSql);
        connection.query(updateSql, function (err, results, fileds) {
          if (err) {
            console.log(JSON.stringify(err));
            resolve(err);
          } else {
            console.log('update employee check: ' + JSON.stringify(results));
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
}
// admin ok
controller.deleteChecks = async function (targetArray) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let deleteSql = 'DELETE FROM employee_check WHERE id IN (' + targetArray.toString() + ');';
      console.log(deleteSql);
      connection.query(deleteSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_check: ' + JSON.stringify(results));
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
// admin ok
controller.getChecksFromLog = async function () {
  let checksRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT * FROM log WHERE (operate_type=\'checkin\' OR operate_type=\'checkout\');';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select all checks: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return checksRes;
}
// personnel ok
controller.getChecksFromEmployeeCheck = async function () {
  let checksRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT * FROM employee_check;';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select all checks: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return checksRes;
}
// head ok
controller.getChecksBelongDepartment = async function (department_id) {
  let employees = await employee_controller.getEmployeeIDsByBelongDepartmentID(department_id);
  let employeeIDArray = [];
  for (let index in employees) {
    employeeIDArray.push(employees[index].employee_id)
  }
  let checksArray = await this.getChecksByEmployeeIDs(employeeIDArray);
  return checksArray;
}
// ok
controller.getChecksByEmployeeIDs = async function (employeeIDArray) {
  let checksRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT * FROM employee_check WHERE employee_id IN (' + employeeIDArray.toString() + ');';
      // console.log(insertSql);
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('query employee ids: ' + employeeIDArray.toString() + ', res: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('query error');
    }
  });
  return checksRes;
}
// own ok
controller.getChecksByEmployeeID = async function (employee_id) {
  let checksRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT * FROM employee_check WHERE employee_id=' + employee_id + ';';
      // console.log(insertSql);
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('query employee id: ' + employee_id + ', res: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('query error');
    }
  });
  return checksRes;
}

module.exports = controller;