let parse_router = require('../../util/parse_router');

let controller = require('../../controller/api/check');
let log = require('../../controller/api/log');
let setting = require('../../controller/api/setting');

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
            logChecks: logChecks,
            employeeChecks: employeeChecks
          });
        } else if (req.session.user.personnelRight === true) {
          // get all checks from employee_check table
          let getRes = await controller.getChecksFromEmployeeCheck();
          res.json({
            getRes: getRes
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
          let getRes = await controller.getChecksByEmployeeID(req.session.user.id);
          res.json({
            getRes: getRes
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
            if (!positiveReg.test(insertCheck.employee_id) || (insertCheck.check_type !== setting.CHECK_IN_NAME && insertCheck.check_type !== setting.CHECK_OUT_NAME) || check_datetime.toString() === 'Invalid Date') {
              res.json({
                insertRes: 'format error'
              });
            } else {
              // need insert
              let insertRes;
              if (insertCheck.check_type === setting.CHECK_IN_NAME) {
                insertRes = await controller.checkInSpecifiedDatetime(insertCheck.employee_id, check_datetime);
              } else {
                insertRes = await controller.checkOutSpecifiedDatetime(insertCheck.employee_id, check_datetime);
              }
              insertCheck.res = insertRes;
              log.insertLog(req.session.user.id, 'add_check', JSON.stringify(insertCheck));
              res.json({
                insertRes: insertRes
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
          updateCheck.check_status = Boolean(updateCheck.check_status);
          let positiveReg = /^[0-9]+$/;
          try {
            let check_datetime = new Date(updateCheck.check_datetime);
            if (updateID !== updateCheck.id || !positiveReg.test(updateCheck.id) || !positiveReg.test(updateCheck.employee_id) || (updateCheck.check_type !== setting.CHECK_IN_NAME && updateCheck.check_type !== setting.CHECK_OUT_NAME) || check_datetime.toString() === 'Invalid Date') {
              res.json({
                insertRes: 'format error'
              });
            } else {
              // need insert
              let updateRes = await controller.updateCheck(updateCheck.id, updateCheck.employee_id, updateCheck.check_type, check_datetime, updateCheck.check_status);
              updateCheck.res = updateRes;
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
    .delete(temp_router_url, async (req, res) => {
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight === true) {
          let deleteArray = req.body;
          let positiveReg = /^[0-9]+$/;
          for (let index in deleteArray) {
            deleteArray[index] = Number(deleteArray[index]);
            if (!positiveReg.test(deleteArray[index])) {
              res.json({
                deleteRes: 'format error'
              });
              return;
            }
          }
          deleteArray = Array.from(new Set(deleteArray));
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
            getRes: 'right error'
          });
        }
      }
    })
}


module.exports = Router;