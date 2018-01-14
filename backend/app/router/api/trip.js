let parse_router = require('../../util/parse_router');
const moment = require('moment');

let controller = require('../../controller/api/trip');
let log = require('../../controller/api/log');
let setting = require('../../controller/api/setting');
let employee_controller = require('../../controller/api/employee');

let Router = function (router, absolute_path) {
  let temp_router_url = parse_router(absolute_path);
  // /api/trip
  router
    .get(temp_router_url, async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight === true) {
          // get all trips from log and employee_check
          // let logChecks = {};
          // try {
          //   logChecks = await controller.getChecksFromLog();
          // } catch (err) {
          //   console.log(err);
          //   logChecks = err;
          // }
          let employeeTrips = await controller.selectAllTrip();
          res.json({
            getRes: {
              // logChecks: logChecks,
              employeeTrips: employeeTrips
            }
          });
        } else if (req.session.user.personnelRight === true) {
          // get all trips from employee_trip table
          let employeeTrips = await controller.selectAllTrip();
          res.json({
            getRes: employeeTrips
          })
        } else if (req.session.user.headRight === true) {
          // get all checks from employee_check table and the same department
          let subordinateRes = await controller.getTripByDepartment(req.session.user.department.id);
          let ownRes = await controller.getTripByEmployee(req.session.user.id);
          for (let index in ownRes) {
            subordinateRes.push(ownRes[index]);
          }
          res.json({
            getRes: subordinateRes
          })
        } else {
          // get own checks
          let getRes = await controller.getTripByEmployee(req.session.user.id);
          res.json({
            getRes: getRes
          })
        }
      }
    })
    .post(temp_router_url, async (req, res) => {
      // general: trip_type, trip_reason, begin_date, end_date, submit_status
      // admin: employee_id, approve_reason, approve_status
      if (req.session.isLogin !== true) {
        res.json({
          insertRes: 'identity error'
        });
      } else {
        let insertTrip = req.body;
        insertTrip.begin_date = new Date(insertTrip.begin_date);
        insertTrip.end_date = new Date(insertTrip.end_date);
        if (insertTrip.submit_status === 'true') {
          insertTrip.submit_status = true;
        } else {
          insertTrip.submit_status = false;
        }
        if (setting.TRIP_TYPE.indexOf(insertTrip.trip_type) === -1 || typeof insertTrip.trip_reason !== 'string' || insertTrip.begin_date.toString() === 'Invalid Date' || insertTrip.end_date.toString() === 'Invalid Date') {
          res.json({
            insertRes: 'format error'
          });
          return;
        }

        insertTrip.begin_date = moment(insertTrip.begin_date).format('YYYY-MM-DD');
        insertTrip.end_date = moment(insertTrip.end_date).format('YYYY-MM-DD');
        if (req.session.user.adminRight) {
          let positiveReg = /^[0-9]+$/;
          insertTrip.employee_id = Number(insertTrip.employee_id);
          insertTrip.approve_status = Boolean(insertTrip.approve_status);
          if (!positiveReg.test(insertTrip.employee_id) || typeof insertTrip.approve_reason !== 'string') {
            res.json({
              insertRes: 'format error'
            });
            return;
          }
          let insertRes = await controller.insertTrip(insertTrip.employee_id, insertTrip.trip_type, insertTrip.trip_reason, insertTrip.begin_date, insertTrip.end_date, insertTrip.submit_status, insertTrip.approve_reason, insertTrip.approve_status);
          let log_type = insertTrip.submit_status ? 'submit_trip' : 'save_trip';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: insertTrip,
            res: insertRes
          }));
          res.json({
            insertRes: insertRes
          });
        } else {
          let tripRes = await controller.insertTripByEmployee(req.session.user.id, insertTrip.trip_type, insertTrip.trip_reason, insertTrip.begin_date, insertTrip.end_date, insertTrip.submit_status);
          let log_type = insertTrip.submit_status ? 'submit_trip' : 'save_trip';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: insertTrip,
            res: tripRes
          }));
          res.json({
            insertRes: tripRes
          });
        }
      }
    })
    .put(temp_router_url + '/:id', async (req, res) => {
      // general: id, trip_type, trip_reason, begin_date, end_date, submit_status
      // admin: employee_id, approve_reason, approve_status
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let updateID = Number(req.params.id);
        let positiveReg = /^[0-9]+$/;
        let updateTrip = req.body;
        updateTrip.id = updateID;
        updateTrip.begin_date = new Date(updateTrip.begin_date);
        updateTrip.end_date = new Date(updateTrip.end_date);
        updateTrip.submit_status = Boolean(updateTrip.submit_status);

        if (!positiveReg.test(updateID) || setting.TRIP_TYPE.indexOf(updateTrip.trip_type) === -1 || typeof updateTrip.trip_reason !== 'string' || updateTrip.begin_date.toString() === 'Invalid Date' || updateTrip.end_date.toString() === 'Invalid Date') {
          res.json({
            updateRes: 'format error'
          });
          return;
        }

        updateTrip.begin_date = moment(updateTrip.begin_date).format('YYYY-MM-DD');
        updateTrip.end_date = moment(updateTrip.end_date).format('YYYY-MM-DD');
        if (req.session.user.adminRight === true) {
          updateTrip.employee_id = Number(updateTrip.employee_id);
          updateTrip.approve_status = Boolean(updateTrip.approve_status);
          if (!positiveReg.test(updateTrip.employee_id) || typeof updateTrip.approve_reason !== 'string') {
            res.json({
              updateRes: 'format error'
            });
            return;
          }
          let updateRes = await controller.updateTrip(updateID, updateTrip.employee_id, updateTrip.trip_type, updateTrip.trip_reason, updateTrip.begin_date, updateTrip.end_date, updateTrip.submit_status, updateTrip.approve_reason, updateTrip.approve_status);
          let log_type = updateTrip.submit_status ? 'submit_trip' : 'save_trip';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: updateTrip,
            res: updateRes
          }));
          res.json({
            updateRes: updateRes
          });
        } else {
          updateTrip.employee_id = req.session.user.id;
          let updateRes = await controller.updateTripByEmployee(updateID, updateTrip.employee_id, updateTrip.trip_type, updateTrip.trip_reason, updateTrip.begin_date, updateTrip.end_date, updateTrip.submit_status);
          let log_type = updateTrip.submit_status ? 'submit_trip' : 'save_trip';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: updateTrip,
            res: updateRes
          }));
          res.json({
            updateRes: updateRes
          });
        }
      }
    })
    .put(temp_router_url + '/approve/:id', async (req, res) => {
      // admin, personnel, head: id, approve_reason, approve_status
      if (req.session.isLogin !== true) {
        res.json({
          updateRes: 'identity error'
        });
      } else {

        let updateID = Number(req.params.id);
        let positiveReg = /^[0-9]+$/;
        let updateTrip = req.body;
        updateTrip.id = updateID;
        updateTrip.approve_status = Boolean(updateTrip.approve_status);
        if (!positiveReg.test(updateID) || typeof updateTrip.approve_reason !== 'string') {
          res.json({
            updateRes: 'format error'
          });
          return;
        }
        let targetTrip = await controller.getTripByID(updateID);
        if (targetTrip.length === 0 || Boolean(targetTrip[0].submit_status) !== true || Boolean(targetTrip[0].approve_status) === true) {
          res.json({
            updateRes: 'approve trip target error'
          });
          return;
        }
        targetTrip = targetTrip[0];
        let targetEmployee = await employee_controller.getIdentityByID(targetTrip.employee_id);
        let approveRight = false;
        if (req.session.user.adminRight === true) {
          approveRight = true;
        } else {
          // cannot approve oneself
          if (targetEmployee.id === req.session.user.id) {
            res.json({
              updateRes: 'cannot approve own trip'
            });
            return;
          }
          if (req.session.user.personnelRight === true && (targetEmployee.department === undefined || targetEmployee.headRight === true)) {
            approveRight = true;
          } else if (req.session.user.headRight === true && targetEmployee.department !== undefined && req.session.user.department.id === targetEmployee.department.id) {
            approveRight = true;
          }
        }

        if (approveRight) {
          let updateRes = await controller.approveTrip(updateID, updateTrip.approve_reason, updateTrip.approve_status);
          let log_type = updateTrip.approve_status ? 'approve_trip' : 'reject_trip';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: updateTrip,
            res: updateRes
          }));
          res.json({
            updateRes: updateRes
          });
        } else {
          res.json({
            updateRes: 'right error'
          });
        }
      }
    })
    .delete(temp_router_url + '/:id', async (req, res) => {
      // general: id, trip_type, trip_reason, begin_date, end_date, submit_status
      // admin: employee_id, approve_reason, approve_status
      if (req.session.isLogin !== true) {
        res.json({
          deleteRes: 'identity error'
        });
      } else {
        let deleteID = Number(req.params.id);
        let targetTrip = await controller.getTripByID(deleteID);
        if (targetTrip.length === 0) {
          res.json({
            deleteRes: 'delete trip target error'
          });
          return;
        }
        targetTrip = targetTrip[0];
        if (req.session.user.adminRight !== true) {
          if (targetTrip.employee_id !== req.session.user.id || Boolean(targetTrip.submit_status) === true || Boolean(targetTrip.approve_status) === true) {
            res.json({
              deleteRes: 'right error'
            });
            return;
          }
          // own
          let deleteRes = await controller.deleteTrips([deleteID]);
          log.insertLog(req.session.user.id, 'delete_trip', JSON.stringify({
            req: deleteID,
            res: deleteRes
          }));
          res.json({
            deleteRes: deleteRes
          });
        } else {
          // admin
          let deleteRes = await controller.deleteTrips([deleteID]);
          log.insertLog(req.session.user.id, 'delete_trip', JSON.stringify({
            req: deleteID,
            res: deleteRes
          }));
          res.json({
            deleteRes: deleteRes
          });
        }
      }
    })
}


module.exports = Router;