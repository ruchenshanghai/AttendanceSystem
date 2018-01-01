let mysql_connect = require('../../util/mysql_connect');

let employee_controller = require('./employee');

let controller = {};

controller.getTripByID = async function (id) {
  let tripsRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT * FROM employee_trip WHERE id=' + id + ';';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select all trip: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return tripsRes;
}
controller.getTripByEmployee = async function (employee_id) {
  let selectRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'SELECT * FROM employee_trip WHERE employee_id=' + employee_id + ';';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select employee_trip: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return selectRes;
}
controller.insertTripByEmployee = async function (employee_id, trip_type, trip_reason, begin_date, end_date, submit_status) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_trip (employee_id, trip_type, trip_reason, begin_date, end_date, submit_status) VALUES (' + employee_id + ', \'' + trip_type + '\', \'' + trip_reason + '\', \'' + begin_date + '\', \'' + end_date + '\', ' + submit_status + ');';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee_trip: ' + JSON.stringify(results));
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
// update un approve true trip
controller.updateTripByEmployee = async function (id, employee_id, trip_type, trip_reason, begin_date, end_date, submit_status) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let updateSql = 'UPDATE employee_trip SET trip_type=\'' + trip_type + '\', trip_reason=\'' + trip_reason + '\', begin_date=\'' + begin_date + '\', end_date=\'' + end_date + '\', submit_status=' + submit_status + ' WHERE id=' + id + ' AND employee_id=' + employee_id + ' AND approve_status IS NOT TRUE;';
      console.log(updateSql);
      connection.query(updateSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update employee_trip: ' + JSON.stringify(results));
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
// delete un submit trip
controller.deleteTripByEmployee = async function (id, employee_id) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'DELETE FROM employee_trip WHERE id=' + id + ' AND employee_id=' + employee_id + ' AND submit_status IS NOT TRUE;';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_trip: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return deleteRes;
}

let getSubmitedTripsByEmployeeIDs = async function (employeeIDArray) {
  let selectRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT * FROM employee_trip WHERE employee_id IN (' + employeeIDArray.toString() + ') AND submit_status=TRUE;';
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
  return selectRes;
}

// can only approve (approve_status not true) trip
controller.approveTrip = async function (id, approve_reason, approve_status) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'UPDATE employee_trip SET approve_reason=\'' + approve_reason + '\', approve_status=' + approve_status + ' WHERE id=' + id + ' AND approve_status IS NOT TRUE AND submit_status=TRUE;';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update employee_trip: ' + JSON.stringify(results));
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
controller.getTripByDepartment = async function (department_id) {
  let employees = await employee_controller.getEmployeeIDsByBelongDepartmentID(department_id);
  let employeeIDArray = [];
  for (let index in employees) {
    employeeIDArray.push(employees[index].employee_id);
  }
  let tripsArray = await getSubmitedTripsByEmployeeIDs(employeeIDArray);
  return tripsArray;
}
controller.getAllSubmitedTrip = async function () {
  let selectRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT * FROM employee_trip WHERE submit_status=TRUE;';
      // console.log(insertSql);
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('query employee trips, res: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('query error');
    }
  });
  return selectRes;
}


controller.selectAllTrip = async function () {
  let tripsRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT * FROM employee_trip;';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select all trip: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return tripsRes;
}
controller.updateTrip = async function (id, employee_id, trip_type, trip_reason, begin_date, end_date, submit_status, approve_reason, approve_status) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'UPDATE employee_trip SET employee_id=' + employee_id + ', trip_type=\'' + trip_type + '\', trip_reason=\'' + trip_reason + '\', begin_date=\'' + begin_date + '\', end_date=\'' + end_date + '\', submit_status=' + submit_status + ', approve_reason=\'' + approve_reason + '\', approve_status=' + approve_status + ' WHERE id=' + id + ';';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update employee_trip: ' + JSON.stringify(results));
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
controller.insertTrip = async function (employee_id, trip_type, trip_reason, begin_date, end_date, submit_status, approve_reason, approve_status) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_trip (employee_id, trip_type, trip_reason, begin_date, end_date, submit_status, approve_reason, approve_status) VALUES (' + employee_id + ', \'' + trip_type + '\', \'' + trip_reason + '\', \'' + begin_date + '\', \'' + end_date + '\', ' + submit_status + ', \'' + approve_reason + '\', ' + approve_status + ');';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee_trip: ' + JSON.stringify(results));
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
controller.deleteTrips = async function (targetArray) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let deleteSql = 'DELETE FROM employee_trip WHERE id IN (' + targetArray.toString() + ');';
      connection.query(deleteSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_trip: ' + JSON.stringify(results));
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