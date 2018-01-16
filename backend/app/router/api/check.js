let parse_router = require('../../util/parse_router');
const moment = require('moment');

let controller = require('../../controller/api/check');
let employee_controller = require('../../controller/api/employee');
let log = require('../../controller/api/log');
// let setting = require('../../controller/api/setting');

let Router = function (router, absolute_path) {
  let temp_router_url = parse_router(absolute_path);
  // /api/check
  router
    .get(temp_router_url, async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight === true) {
          // get all checks from log and employee_check
          let logChecks = {};
          try {
            logChecks = await controller.getChecksFromLog();
          } catch (err) {
            console.log(err);
            logChecks = err;
          }
          let employeeChecks = await controller.getChecksFromEmployeeCheck();
          res.json({
            getRes: {
              logChecks: logChecks,
              employeeChecks: employeeChecks
            }
          });
        } else if (req.session.user.personnelRight === true) {
          // get all checks from employee_check table
          let resChecks = await controller.getChecksFromEmployeeCheck();
          res.json({
            getRes: resChecks
          })
        } else if (req.session.user.headRight === true) {
          // get all checks from employee_check table and the same department
          let subordinateRes = await controller.getChecksBelongDepartment(req.session.user.department.id);
          let ownRes = await controller.getChecksByEmployeeID(req.session.user.id);
          for (let index in ownRes) {
            subordinateRes.push(ownRes[index]);
          }
          res.json({
            getRes: subordinateRes
          })
        } else {
          // get own checks
          let resChecks = await controller.getChecksByEmployeeID(req.session.user.id);
          res.json({
            getRes: resChecks
          })
        }
      }
    })
    .get(temp_router_url + '/employee_id/:id', async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
        return;
      }
      let tempEmployeeID = Number(req.params.id);
      if (tempEmployeeID <= 0 || tempEmployeeID === Infinity) {
        res.json({
          getRes: 'format error'
        });
        return;
      }

      let selectRight = false;
      let resChecks = [];
      if (req.session.user.adminRight === true || req.session.user.personnelRight === true || tempEmployeeID === req.session.user.id) {
        // get all checks from log and employee_check
        selectRight = true;
        resChecks = await controller.getChecksByEmployeeID(tempEmployeeID);
        res.json({
          getRes: resChecks
        });
      } else if (req.session.user.headRight === true) {
        let tempChecks = await controller.getChecksBelongDepartment(req.session.user.department.id);
        for (let index in tempChecks) {
          if (tempChecks[index].employee_id === tempEmployeeID) {
            if (selectRight === false) {
              selectRight = true;
            }
            resChecks.push(tempChecks[index]);
          }
        }
        if (selectRight) {
          res.json({
            getRes: resChecks
          });
        } else {
          res.json({
            getRes: 'right error'
          })
        }
      } else {
        res.json({
          getRes: 'right error'
        })
      }
    })
    .get(temp_router_url + '/employee_name/:name', async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let tempName = req.params.name;
        let selectEmployeeIDs = [];
        if (req.session.user.adminRight === true || req.session.user.personnelRight === true) {
          // get all checks from log and employee_check
          let tempEmployees = await employee_controller.getIdentityByName(tempName);
          for (let index in tempEmployees) {
            selectEmployeeIDs.push(tempEmployees[index].id);
          }
        } else if (req.session.user.headRight === true) {
          // need check department_id
          let tempEmployees = await employee_controller.getIdentityByName(tempName);
          for (let index in tempEmployees) {
            if (tempEmployees[index].department !== undefined && tempEmployees[index].department.id !== req.session.user.department.id) {
              selectEmployeeIDs.push(tempEmployees[index].id);
            }
          }
        } else {
          res.json({
            getRes: 'right error'
          });
          return;
        }

        if (selectEmployeeIDs.length === 0) {
          res.json({
            getRes: 'no legal checks'
          })
        } else {
          let resChecks = await controller.getChecksByEmployeeIDs(selectEmployeeIDs);
          res.json({
            getRes: resChecks
          })
        }
      }
    })
    .get(temp_router_url + '/department_id/:department_id', async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let tempDepartmentID = Number(req.params.department_id);
        if (tempDepartmentID <= 0 || tempDepartmentID === Infinity) {
          res.json({
            getRes: 'format error'
          });
          return;
        }
        if (req.session.user.adminRight === true || req.session.user.personnelRight === true || (req.session.user.headRight === true && req.session.user.department.id === tempDepartmentID)) {
          let resChecks = await controller.getChecksBelongDepartment(tempDepartmentID);
          res.json({
            getRes: resChecks
          })
        } else {
          res.json({
            getRes: 'right error'
          })
        }
      }
    })
    .get(temp_router_url + '/date/:date', async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let tempDate = new Date(req.params.date);
        if (tempDate.toString() === 'Invalid Date') {
          res.json({
            getRes: 'format error'
          });
          return;
        }

        if (req.session.user.headRight === true) {
          tempDate = moment(tempDate).format('YYYY-MM-DD');
          let resChecks = [];
          let tempChecks = await controller.getChecksBelongDepartment(req.session.user.department.id);
          for (let index in resChecks) {
            if (tempChecks[index].check_date === tempDate) {
              resChecks.push(tempChecks[index]);
            }
          }
          res.json({
            getRes: resChecks
          })
        } else {
          res.json({
            getRes: 'right error'
          })
        }
      }
    })
    .get(temp_router_url + '/check_in_status/:check_in_status', async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let tempStatus = Boolean(req.params.check_in_status);

        if (req.session.user.headRight === true) {
          let resChecks = [];
          let tempChecks = await controller.getChecksBelongDepartment(req.session.user.department.id);
          for (let index in resChecks) {
            if (tempChecks[index].check_in_status !== null && Boolean(tempChecks[index].check_in_status) === tempStatus) {
              resChecks.push(tempChecks[index]);
            }
          }
          res.json({
            getRes: resChecks
          })
        } else {
          res.json({
            getRes: 'right error'
          })
        }
      }
    })
    .get(temp_router_url + '/check_out_status/:check_out_status', async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let tempStatus = Boolean(req.params.check_out_status);

        if (req.session.user.headRight === true) {
          let resChecks = [];
          let tempChecks = await controller.getChecksBelongDepartment(req.session.user.department.id);
          for (let index in resChecks) {
            if (tempChecks[index].check_out_status !== null && Boolean(tempChecks[index].check_out_status) === tempStatus) {
              resChecks.push(tempChecks[index]);
            }
          }
          res.json({
            getRes: resChecks
          })
        } else {
          res.json({
            getRes: 'right error'
          })
        }
      }
    })
    .get(temp_router_url + '/check_in_status/:check_in_status/check_out_status/:check_out_status', async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let tempInStatus = Boolean(req.params.check_in_status);
        let tempOutStatus = Boolean(req.params.check_out_status);

        if (req.session.user.headRight === true) {
          let resChecks = [];
          let tempChecks = await controller.getChecksBelongDepartment(req.session.user.department.id);
          for (let index in resChecks) {
            if (tempChecks[index].check_in_status !== null && Boolean(tempChecks[index].check_in_status) === tempInStatus && tempChecks[index].check_out_status !== null && Boolean(tempChecks[index].check_out_status) === tempOutStatus) {
              resChecks.push(tempChecks[index]);
            }
          }
          res.json({
            getRes: resChecks
          })
        } else {
          res.json({
            getRes: 'right error'
          })
        }
      }
    })
    .get(temp_router_url + '/date/:date/check_in_status/:check_in_status/check_out_status/:check_out_status', async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let tempDate = new Date(req.params.date);
        if (tempDate.toString() === 'Invalid Date') {
          res.json({
            getRes: 'format error'
          });
          return;
        }
        tempDate = moment(tempDate).format('YYYY-MM-DD');
        let tempInStatus = Boolean(req.params.check_in_status);
        let tempOutStatus = Boolean(req.params.check_out_status);

        if (req.session.user.headRight === true) {
          let resChecks = [];
          let tempChecks = await controller.getChecksBelongDepartment(req.session.user.department.id);
          for (let index in resChecks) {
            if (tempChecks[index].check_date === tempDate) {
              resChecks.push(tempChecks[index]);
            }
            if (tempChecks[index].check_date === tempDate && tempChecks[index].check_in_status !== null && Boolean(tempChecks[index].check_in_status) === tempInStatus && tempChecks[index].check_out_status !== null && Boolean(tempChecks[index].check_out_status) === tempOutStatus) {
              resChecks.push(tempChecks[index]);
            }
          }
          res.json({
            getRes: resChecks
          })
        } else {
          res.json({
            getRes: 'right error'
          })
        }
      }
    })
    .post(temp_router_url + '/IN', async (req, res) => {
      // only for admin, delete logs array
      if (req.session.isLogin !== true) {
        res.json({
          checkInRes: 'identity error'
        });
      } else {
        let checkInRes = await controller.checkIn(req.session.user.id);
        log.insertLog(req.session.user.id, 'checkin', JSON.stringify(checkInRes));
        console.log(JSON.stringify(checkInRes));
        res.json({
          checkInRes: checkInRes
        });
      }
    })
    .post(temp_router_url + '/OUT', async (req, res) => {
      // only for admin, delete logs array
      if (req.session.isLogin !== true) {
        res.json({
          checkInRes: 'identity error'
        });
      } else {
        let checkOutRes = await controller.checkOut(req.session.user.id);
        log.insertLog(req.session.user.id, 'checkout', JSON.stringify(checkOutRes));
        console.log(JSON.stringify(checkOutRes));
        res.json({
          checkOutRes: checkOutRes
        });
      }
    })
    .post(temp_router_url, async (req, res) => {
      if (req.session.isLogin !== true) {
        res.json({
          insertRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight === true) {
          let insertCheck = req.body;
          let positiveReg = /^[0-9]+$/;
          try {
            let check_datetime = new Date(insertCheck.check_datetime);
            if (!positiveReg.test(insertCheck.employee_id) || (insertCheck.check_type !== 'IN' && insertCheck.check_type !== 'OUT') || check_datetime.toString() === 'Invalid Date') {
              res.json({
                insertRes: 'format error'
              });
            } else {
              // need check
              if (insertCheck.check_type === 'IN') {
                let checkInRes = await controller.checkInSpecifiedDatetime(insertCheck.employee_id, check_datetime);
                log.insertLog(req.session.user.id, 'checkin', JSON.stringify({
                  req: insertCheck,
                  res: checkInRes
                }));
                console.log(JSON.stringify(checkInRes));
                res.json({
                  insertRes: checkInRes
                });
              } else {
                let checkOutRes = await controller.checkOutSpecifiedDatetime(insertCheck.employee_id, check_datetime);
                log.insertLog(req.session.user.id, 'checkout', JSON.stringify({
                  req: insertCheck,
                  res: checkOutRes
                }));
                console.log(JSON.stringify(checkOutRes));
                res.json({
                  insertRes: checkOutRes
                });
              }
            }
          } catch (err) {
            console.log(JSON.stringify(err));
            res.json({
              insertRes: err
            });
          }
        } else {
          res.json({
            insertRes: 'right error'
          });
        }
      }
    })
    .put(temp_router_url + '/:id', async (req, res) => {
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight === true) {
          let updateID = Number(req.params.id);
          let updateCheck = req.body;
          updateCheck.id = updateID;
          if (updateCheck.check_in_status === true || updateCheck.check_in_status === 'true') {
            updateCheck.check_in_status = true;
          } else {
            updateCheck.check_in_status = false;
          }
          if (updateCheck.check_out_status === true || updateCheck.check_out_status === 'true') {
            updateCheck.check_out_status = true;
          } else {
            updateCheck.check_out_status = false;
          }
          console.log(JSON.stringify(updateCheck));
          let positiveReg = /^[0-9]+$/;
          try {
            updateCheck.check_in_time = new Date(updateCheck.check_date + ' ' + updateCheck.check_in_time);
            updateCheck.check_out_time = new Date(updateCheck.check_date + ' ' + updateCheck.check_out_time);
            if (!positiveReg.test(updateID) || !positiveReg.test(updateCheck.employee_id) || updateCheck.check_in_time.toString() === 'Invalid Date' || updateCheck.check_out_time.toString() === 'Invalid Date') {
              res.json({
                insertRes: 'format error'
              });
            } else {
              // need update
              let updateRes = await controller.updateCheck(updateCheck.id, updateCheck.employee_id, updateCheck.check_in_time, updateCheck.check_in_status, updateCheck.check_out_time, updateCheck.check_out_status);
              // updateCheck.res = updateRes; err sql \" "
              log.insertLog(req.session.user.id, 'modify_check', JSON.stringify(updateCheck));
              res.json({
                insertRes: updateRes
              });
            }
          } catch (err) {
            console.log(JSON.stringify(err));
            res.json({
              insertRes: err
            });
          }
        } else {
          res.json({
            getRes: 'right error'
          });
        }
      }
    })
    .delete(temp_router_url + '/:id', async (req, res) => {
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight === true) {
          let deleteArray = [];
          let deleteID = Number(req.params.id);
          let positiveReg = /^[0-9]+$/;
          if (!positiveReg.test(deleteID)) {
            res.json({
              deleteRes: 'format error'
            });
          } else {
            deleteArray.push(deleteID);
          }
          let deleteRes = await controller.deleteChecks(deleteArray);
          let logObj = {
            id: deleteArray,
            res: deleteRes
          };
          log.insertLog(req.session.user.id, 'delete_check', JSON.stringify(logObj));
          res.json({
            deleteRes: deleteRes
          });
        } else {
          res.json({
            deleteRes: 'right error'
          });
        }
      }
    })
}


module.exports = Router;