let mysql_connect = require('../../util/mysql_connect');

let employee_controller = require('./employee');

let controller = {};

controller.getLeaveByEmployee = async function (employee_id) {
  let selectRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'SELECT * FROM employee_leave WHERE employee_id=' + employee_id + ';';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select employee_leave: ' + JSON.stringify(results));
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
controller.insertLeaveByEmployee = async function (employee_id, leave_type, leave_reason, begin_date, end_date, submit_status) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_leave (employee_id, leave_type, leave_reason, begin_date, end_date, submit_status) VALUES (' + employee_id + ', \'' + leave_type + '\', \'' + leave_reason + '\', \'' + begin_date + '\', \'' + end_date + '\', ' + submit_status + ');';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee_leave: ' + JSON.stringify(results));
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
// update un approve true leave
controller.updateLeaveByEmployee = async function (id, employee_id, leave_type, leave_reason, begin_date, end_date, submit_status) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'UPDATE employee_leave SET leave_type=\'' + leave_type + '\', leave_reason=\'' + leave_reason + '\', begin_date=\'' + begin_date + '\', end_date=\'' + end_date + '\', submit_status=' + submit_status + ' WHERE id=' + id + ' AND employee_id=' + employee_id + ' AND approve_status!=TRUE;';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update employee_leave: ' + JSON.stringify(results));
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
// delete un submit leave
controller.deleteLeaveByEmployee = async function (id, employee_id) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'DELETE FROM employee_leave WHERE id=' + id + ' AND employee_id=' + employee_id + ' AND (submit_status=FALSE OR submit_status IS NULL);';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_leave: ' + JSON.stringify(results));
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

let getSubmitedLeavesByEmployeeIDs = async function (employeeIDArray) {
  let selectRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT * FROM employee_leave WHERE employee_id IN (' + employeeIDArray.toString() + ') AND submit_status=TRUE;';
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

// can only approve (approve_status not true) leave
controller.approveLeave = async function (id, approve_reason, approve_status) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'UPDATE employee_leave SET approve_reason=\'' + approve_reason + '\', approve_status=' + approve_status + ' WHERE id=' + id + ' AND approve_status!=TRUE AND submit_status=TRUE;';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update employee_leave: ' + JSON.stringify(results));
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
controller.getLeaveByDepartment = async function (department_id) {
  let employees = await employee_controller.getEmployeeIDsByBelongDepartmentID(department_id);
  let employeeIDArray = [];
  for (let index in employees) {
    employeeIDArray.push(employees[index].employee_id);
  }
  let leavesArray = await getSubmitedLeavesByEmployeeIDs(employeeIDArray);
  return leavesArray;
}
controller.getAllSubmitedLeave = async function () {
  let selectRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let querySql = 'SELECT * FROM employee_leave WHERE submit_status=TRUE;';
      // console.log(insertSql);
      connection.query(querySql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('query employee leaves, res: ' + JSON.stringify(results));
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


controller.selectAllLeave = async function () {
  let leavesRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT * FROM employee_leave;';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select all leave: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return leavesRes;
}
controller.updateLeave = async function (id, employee_id, leave_type, leave_reason, begin_date, end_date, submit_status, approve_reason, approve_status) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'UPDATE employee_leave SET employee_id=' + employee_id + ', leave_type=\'' + leave_type + '\', leave_reason=\'' + leave_reason + '\', begin_date=\'' + begin_date + '\', end_date=\'' + end_date + '\', submit_status=' + submit_status + ', approve_reason=\'' + approve_reason + '\', approve_status=' + approve_status + ' WHERE id=' + id + ';';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update employee_leave: ' + JSON.stringify(results));
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
controller.insertLeave = async function (employee_id, leave_type, leave_reason, begin_date, end_date, submit_status, approve_reason, approve_status) {
  let insertRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let insertSql = 'INSERT INTO employee_leave (employee_id, leave_type, leave_reason, begin_date, end_date, submit_status, approve_reason, approve_status) VALUES (' + employee_id + ', \'' + leave_type + '\', \'' + leave_reason + '\', \'' + begin_date + '\', \'' + end_date + '\', ' + submit_status + ', \'' + approve_reason + '\', ' + approve_status + ');';
      connection.query(insertSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('insert employee_leave: ' + JSON.stringify(results));
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
controller.deleteLeaves = async function (targetArray) {
  let deleteRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let deleteSql = 'DELETE FROM employee_leave WHERE id IN (' + targetArray.toString() + ');';
      connection.query(deleteSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('delete employee_leave: ' + JSON.stringify(results));
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

//
// let dismissEmployeeBelongTo = async function (employee_id) {
//   let deleteRes = await new Promise((resolve, reject) => {
//     try {
//       let connection = mysql_connect();
//       connection.connect();
//       console.log('oepn connection');
//       let insertSql = 'DELETE FROM employee_belong_department WHERE employee_id=' + employee_id + ';';
//       connection.query(insertSql, function (err, results, fileds) {
//         if (err) {
//           console.log(JSON.stringify(err));
//           resolve(err);
//         } else {
//           console.log('delete employee_belong_department: ' + JSON.stringify(results));
//           resolve(results);
//         }
//       });
//       console.log('close connection');
//       connection.end();
//     } catch (err) {
//       resolve('insert error');
//     }
//   });
//   return deleteRes;
// }
//
// controller.assignHeadToDepartment = async function (employee_id, department_id) {
//   let insertRes = await new Promise((resolve, reject) => {
//     try {
//       let connection = mysql_connect();
//       connection.connect();
//       console.log('oepn connection');
//       let insertSql = 'INSERT INTO employee_head_department (employee_id, department_id) VALUES (' + employee_id + ', ' + department_id + ');';
//       // console.log(insertSql);
//       connection.query(insertSql, function (err, results, fileds) {
//         if (err) {
//           console.log(JSON.stringify(err));
//           resolve(err);
//         } else {
//           console.log('insert employee_head_department: ' + JSON.stringify(results));
//           resolve(results);
//         }
//       });
//       console.log('close connection');
//       connection.end();
//     } catch (err) {
//       resolve('insert error');
//     }
//   });
//   return insertRes;
// }
//
// let dismissEmployeeHead = async function (employee_id) {
//   let deleteRes = await new Promise((resolve, reject) => {
//     try {
//       let connection = mysql_connect();
//       connection.connect();
//       console.log('oepn connection');
//       let insertSql = 'DELETE FROM employee_head_department WHERE employee_id=' + employee_id + ';';
//       connection.query(insertSql, function (err, results, fileds) {
//         if (err) {
//           console.log(JSON.stringify(err));
//           resolve(err);
//         } else {
//           console.log('delete employee_head_department: ' + JSON.stringify(results));
//           resolve(results);
//         }
//       });
//       console.log('close connection');
//       connection.end();
//     } catch (err) {
//       resolve('insert error');
//     }
//   });
//   return deleteRes;
// }
//
// controller.assignPersonnel = async function (employee_id) {
//   let insertRes = await new Promise((resolve, reject) => {
//     try {
//       let connection = mysql_connect();
//       connection.connect();
//       console.log('oepn connection');
//       let insertSql = 'INSERT INTO employee_personnel (employee_id) VALUES (' + employee_id + ');';
//       // console.log(insertSql);
//       connection.query(insertSql, function (err, results, fileds) {
//         if (err) {
//           console.log(JSON.stringify(err));
//           resolve(err);
//         } else {
//           console.log('insert employee_personnel: ' + JSON.stringify(results));
//           resolve(results);
//         }
//       });
//       console.log('close connection');
//       connection.end();
//     } catch (err) {
//       resolve('insert error');
//     }
//   });
//   return insertRes;
// }
//
// let dismissEmployeePersonnel = async function (employee_id) {
//   let deleteRes = await new Promise((resolve, reject) => {
//     try {
//       let connection = mysql_connect();
//       connection.connect();
//       console.log('oepn connection');
//       let insertSql = 'DELETE FROM employee_personnel WHERE employee_id=' + employee_id + ';';
//       connection.query(insertSql, function (err, results, fileds) {
//         if (err) {
//           console.log(JSON.stringify(err));
//           resolve(err);
//         } else {
//           console.log('delete employee_personnel: ' + JSON.stringify(results));
//           resolve(results);
//         }
//       });
//       console.log('close connection');
//       connection.end();
//     } catch (err) {
//       resolve('insert error');
//     }
//   });
//   return deleteRes;
// }
//
// controller.assignAdministrator = async function (employee_id) {
//   let insertRes = await new Promise((resolve, reject) => {
//     try {
//       let connection = mysql_connect();
//       connection.connect();
//       console.log('oepn connection');
//       let insertSql = 'INSERT INTO employee_administrator (employee_id) VALUES (' + employee_id + ');';
//       // console.log(insertSql);
//       connection.query(insertSql, function (err, results, fileds) {
//         if (err) {
//           console.log(JSON.stringify(err));
//           resolve(err);
//         } else {
//           console.log('insert employee_personnel: ' + JSON.stringify(results));
//           resolve(results);
//         }
//       });
//       console.log('close connection');
//       connection.end();
//     } catch (err) {
//       resolve('insert error');
//     }
//   });
//   return insertRes;
// }
//
// let dismissEmployeeAdministrator = async function (employee_id) {
//   let deleteRes = await new Promise((resolve, reject) => {
//     try {
//       let connection = mysql_connect();
//       connection.connect();
//       console.log('oepn connection');
//       let insertSql = 'DELETE FROM employee_administrator WHERE employee_id=' + employee_id + ';';
//       connection.query(insertSql, function (err, results, fileds) {
//         if (err) {
//           console.log(JSON.stringify(err));
//           resolve(err);
//         } else {
//           console.log('delete employee_administrator: ' + JSON.stringify(results));
//           resolve(results);
//         }
//       });
//       console.log('close connection');
//       connection.end();
//     } catch (err) {
//       resolve('insert error');
//     }
//   });
//   return deleteRes;
// }
//
// controller.dismissEmployeeByAdministrator = async function (employee) {
//   let dismissRes = {};
//   if (employee.adminRight) {
//     dismissRes = await dismissEmployeeAdministrator(employee.id);
//   } else if (employee.personnelRight) {
//     dismissRes = await dismissEmployeePersonnel(employee.id);
//   } else if (employee.headRight) {
//     dismissRes = await dismissEmployeeHead(employee.id);
//   } else if (employee.department !== undefined) {
//     dismissRes = await dismissEmployeeBelongTo(employee.id);
//   }
//   return dismissRes;
// }
//
// controller.dismissEmployeeByPersonnel = async function (employee) {
//   let dismissRes = {};
//   if (employee.adminRight) {
//     dismissRes = false;
//   } else if (employee.personnelRight) {
//     dismissRes = false;
//   } else if (employee.headRight) {
//     dismissRes = await dismissEmployeeHead(employee.id);
//   } else if (employee.department !== undefined) {
//     dismissRes = await dismissEmployeeBelongTo(employee.id);
//   }
//   return dismissRes;
// }

module.exports = controller;