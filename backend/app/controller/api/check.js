const moment = require('moment');
let mysql_connect = require('../../util/mysql_connect');

let setting_controller = require('./setting');
let employee_controller = require('./employee');

// check_date: YYYY-MM-DD, check_type: SIGN_IN or SIGN_OUT
let getDateCheckedCount = async function (employee_id, check_date, check_type) {
  let checkCountRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT count(*) AS count FROM employee_check WHERE (employee_id = ' + employee_id + ' AND check_datetime LIKE \'' + check_date + '%\' AND check_type = \'' + check_type + '\');';
      // console.log(insertSql);
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('query employee id: ' + employee_id + ', check type: ' + check_type + ', check date: ' + check_date + ', res: ' + JSON.stringify(results[0]));
          resolve(results[0]);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('query error');
    }
  });
  return checkCountRes;
}

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

let insertCheck = async function (employee_id, check_datetime, check_type, check_status) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_check (employee_id, check_type, check_datetime, check_status) VALUES (' + employee_id + ', \'' + check_type + '\', \'' + check_datetime + '\', ' + check_status + ' )';
      // console.log(insertSql);
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee id: ' + employee_id + ', check type: ' + check_type + ', check date: ' + check_datetime + ', res: ' + JSON.stringify(results));
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

let getChecksByEmployeeIDs = async function (employeeIDArray) {
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
          resolve(integrateEmployeeChecks(results));
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

let integrateEmployeeChecks = function (checks) {
  let employeeIDs = [];
  let employees = {};
  for (let index in checks) {
    let tempCheck = {
      check_id: checks[index].id,
      check_type: checks[index].check_type,
      check_datetime: new Date(checks[index].check_datetime),
      check_status: checks[index].check_status
    }
    if (employeeIDs.indexOf(checks[index].employee_id) > -1) {
      employees[checks[index].employee_id].push(tempCheck);
    } else {
      employeeIDs.push(checks[index].employee_id);
      let tempChecks = [];
      tempChecks.push(tempCheck);
      employees[checks[index].employee_id] = tempChecks;
    }
  }
  for (let employee_id in employees) {
    let employee_checks = employees[employee_id];
    let temp_results = {};
    let temp_dates = [];
    for (let index in employee_checks) {
      let temp_date = employee_checks[index].check_datetime.toLocaleDateString();
      if (temp_dates.indexOf(temp_date) === -1) {
        temp_dates.push(temp_date);
        temp_results[temp_date] = {};
      }
      switch (employee_checks[index].check_type) {
        case setting_controller.CHECK_IN_NAME: {
          temp_results[temp_date].check_in_id = employee_checks[index].check_id;
          temp_results[temp_date].check_in_time = employee_checks[index].check_datetime.toLocaleString();
          temp_results[temp_date].check_in_legal = employee_checks[index].check_status;
        }
          break;
        case setting_controller.CHECK_OUT_NAME: {
          temp_results[temp_date].check_out_id = employee_checks[index].check_id;
          temp_results[temp_date].check_out_time = employee_checks[index].check_datetime.toLocaleString();
          temp_results[temp_date].check_out_legal = employee_checks[index].check_status;
        }
          break;
      }
    }
    employees[employee_id] = temp_results;
  }
  let results = [];
  for (let employee_id in employees) {
    let temp_result = {};
    temp_result.employee_id = Number(employee_id);
    temp_result.checks = employees[employee_id];
    results.push(temp_result);
  }
  return results;
}

let integrateLogChecks = function (logs) {
  let legalChecks = [];
  for (let index in logs) {
    let tempCheck = JSON.parse(logs[index].operate_value);
    if (tempCheck.employee_check_id !== undefined) {
      tempCheck.id = tempCheck.employee_check_id;
      tempCheck.employee_id = logs[index].employee_id;
      delete tempCheck.employee_check_id;
      legalChecks.push(tempCheck);
    }
  }
  console.log(JSON.stringify(legalChecks));
  return integrateEmployeeChecks(legalChecks);
}

let controller = {};
// insert log format: employee_id, operate_type, operate_value, only for server
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
  // check if check in already
  let checkInCount = await getDateCheckedCount(employee_id, check_date, setting_controller.CHECK_IN_NAME);
  if (checkInCount.count !== undefined && checkInCount.count === 0) {
    // need check in
    let check_status = await isCheckInStatusLegal(check_time);
    if (check_status === null) {
      return {
        check_status: 'time error'
      };
    } else {
      let insertRes = await insertCheck(employee_id, check_datetime, setting_controller.CHECK_IN_NAME, check_status);
      if (insertRes.affectedRows !== undefined && insertRes.affectedRows === 1) {
        return {
          employee_check_id: insertRes.insertId,
          check_type: setting_controller.CHECK_IN_NAME,
          check_datetime: check_datetime,
          check_status: check_status
        };
      } else {
        return {
          insertRes: insertRes
        };
      }
    }
  } else {
    return {
      checkInCount: checkInCount
    };
  }
}

controller.checkInSpecifiedDatetime = async function (employee_id, date_time) {
  let check_datetime = moment(date_time).format('YYYY-MM-DD HH:mm:ss');
  let check_date = moment(check_datetime).format('YYYY-MM-DD');
  let check_time = moment(check_datetime).format('HH:mm:ss');
  // check if the date need work
  // if (new Date(check_date).getDay() % 6 == 0) {
  //   // weekend
  //   return {
  //     check_status: 'date error'
  //   }
  // }
  // check if check in already
  let checkInCount = await getDateCheckedCount(employee_id, check_date, setting_controller.CHECK_IN_NAME);
  if (checkInCount.count !== undefined && checkInCount.count === 0) {
    // need check in
    let check_status = await isCheckInStatusLegal(check_time);
    if (check_status === null) {
      return {
        check_status: 'time error'
      };
    } else {
      let insertRes = await insertCheck(employee_id, check_datetime, setting_controller.CHECK_IN_NAME, check_status);
      if (insertRes.affectedRows !== undefined && insertRes.affectedRows === 1) {
        return {
          employee_check_id: insertRes.insertId,
          check_type: setting_controller.CHECK_IN_NAME,
          check_datetime: check_datetime,
          check_status: check_status
        };
      } else {
        return {
          insertRes: insertRes
        };
      }
    }
  } else {
    return {
      checkInCount: checkInCount
    };
  }
}

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
  // check if check in already
  let checkInCount = await getDateCheckedCount(employee_id, check_date, setting_controller.CHECK_IN_NAME);
  if (checkInCount.count !== undefined && checkInCount.count === 1) {
    // check if check out already
    let checkOutCount = await getDateCheckedCount(employee_id, check_date, setting_controller.CHECK_OUT_NAME);
    if (checkOutCount.count !== undefined && checkOutCount.count === 0) {
      let check_status = await isCheckOutStatusLegal(check_time);
      if (check_status === null) {
        return {
          check_status: 'time error'
        };
      } else {
        // need check out
        let insertRes = await insertCheck(employee_id, check_datetime, setting_controller.CHECK_OUT_NAME, check_status);
        if (insertRes.affectedRows !== undefined && insertRes.affectedRows === 1) {
          return {
            employee_check_id: insertRes.insertId,
            check_type: setting_controller.CHECK_OUT_NAME,
            check_datetime: check_datetime,
            check_status: check_status
          };
        } else {
          return {
            insertRes: insertRes
          };
        }
      }

    } else {
      return {
        checkOutCount: checkOutCount
      };
    }
  } else {
    return {
      checkInCount: checkInCount
    };
  }
}

controller.checkOutSpecifiedDatetime = async function (employee_id, date_time) {
  let check_datetime = moment(date_time).format('YYYY-MM-DD HH:mm:ss');
  let check_date = moment(check_datetime).format('YYYY-MM-DD');
  let check_time = moment(check_datetime).format('HH:mm:ss');
  // check if the date need work
  // if (new Date(check_date).getDay() % 6 == 0) {
  //   // weekend
  //   return {
  //     check_status: 'date error'
  //   }
  // }
  // check if check in already
  let checkInCount = await getDateCheckedCount(employee_id, check_date, setting_controller.CHECK_IN_NAME);
  if (checkInCount.count !== undefined && checkInCount.count === 1) {
    // check if check out already
    let checkOutCount = await getDateCheckedCount(employee_id, check_date, setting_controller.CHECK_OUT_NAME);
    if (checkOutCount.count !== undefined && checkOutCount.count === 0) {
      let check_status = await isCheckOutStatusLegal(check_time);
      if (check_status === null) {
        return {
          check_status: 'time error'
        };
      } else {
        // need check out
        let insertRes = await insertCheck(employee_id, check_datetime, setting_controller.CHECK_OUT_NAME, check_status);
        if (insertRes.affectedRows !== undefined && insertRes.affectedRows === 1) {
          return {
            employee_check_id: insertRes.insertId,
            check_type: setting_controller.CHECK_OUT_NAME,
            check_datetime: check_datetime,
            check_status: check_status
          };
        } else {
          return {
            insertRes: insertRes
          };
        }
      }
    } else {
      return {
        checkOutCount: checkOutCount
      };
    }
  } else {
    return {
      checkInCount: checkInCount
    };
  }
}

// admin
controller.updateCheck = async function (employee_check_id, employee_id, check_type, date_time, check_status) {
  let check_datetime = moment(date_time).format('YYYY-MM-DD HH:mm:ss');
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
      let updateSql = 'UPDATE employee_check SET employee_id=' + employee_id + ', check_type=\'' + check_type + '\', check_datetime=\'' + check_datetime + '\', check_status=' + check_status + ' WHERE id=' + employee_check_id + ';';
      // console.log(insertSql);
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
// admin
controller.deleteChecks = async function (targetArray) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let deleteSql = 'DELETE FROM employee_check WHERE id IN (' + targetArray.toString() + ');';
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
// admin
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
          resolve(integrateLogChecks(results));
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
// personnel
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
          resolve(integrateEmployeeChecks(results));
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
// head
controller.getChecksBelongDepartment = async function (department_id) {
  let subordinateIDs = await employee_controller.getEmployeeIDsByBelongDepartmentID(department_id);
  let employeeIDArray = [];
  for (let index in subordinateIDs) {
    employeeIDArray.push(subordinateIDs[index].employee_id)
  }
  let checksArray = await getChecksByEmployeeIDs(employeeIDArray);
  return checksArray;
}
// own
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
          resolve(integrateEmployeeChecks(results));
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