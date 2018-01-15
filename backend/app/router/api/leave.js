let parse_router = require('../../util/parse_router');
const moment = require('moment');

let controller = require('../../controller/api/leave');
let log = require('../../controller/api/log');
let setting = require('../../controller/api/setting');
let employee_controller = require('../../controller/api/employee');

let Router = function (router, absolute_path) {
  let temp_router_url = parse_router(absolute_path);
  // /api/leave
  router
    .get(temp_router_url, async (req, res) => {
      // get all checks
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight === true) {
          // get all leaves from log and employee_check
          // let logChecks = {};
          // try {
          //   logChecks = await controller.getChecksFromLog();
          // } catch (err) {
          //   console.log(err);
          //   logChecks = err;
          // }
          let employeeLeaves = await controller.selectAllLeave();
          res.json({
            getRes: {
              // logChecks: logChecks,
              employeeLeaves: employeeLeaves
            }
          });
        } else if (req.session.user.personnelRight === true) {
          // get all leaves from employee_leave table
          let employeeLeaves = await controller.selectAllLeave();
          res.json({
            getRes: employeeLeaves
          })
        } else if (req.session.user.headRight === true) {
          // get all checks from employee_check table and the same department
          let subordinateRes = await controller.getLeaveByDepartment(req.session.user.department.id);
          let ownRes = await controller.getLeaveByEmployee(req.session.user.id);
          for (let index in ownRes) {
            subordinateRes.push(ownRes[index]);
          }
          res.json({
            getRes: subordinateRes
          })
        } else {
          // get own checks
          let getRes = await controller.getLeaveByEmployee(req.session.user.id);
          res.json({
            getRes: getRes
          })
        }
      }
    })
    .post(temp_router_url, async (req, res) => {
      // general: leave_type, leave_reason, begin_date, end_date, submit_status
      // admin: employee_id, approve_reason, approve_status
      if (req.session.isLogin !== true) {
        res.json({
          insertRes: 'identity error'
        });
      } else {
        let insertLeave = req.body;
        insertLeave.begin_date = new Date(insertLeave.begin_date);
        insertLeave.end_date = new Date(insertLeave.end_date);
        if (insertLeave.submit_status === 'true' || insertLeave.submit_status === true) {
          insertLeave.submit_status = true;
        } else {
          insertLeave.submit_status = false;
        }
        if (setting.LEAVE_TYPE.indexOf(insertLeave.leave_type) === -1 || typeof insertLeave.leave_reason !== 'string' || insertLeave.begin_date.toString() === 'Invalid Date' || insertLeave.end_date.toString() === 'Invalid Date') {
          res.json({
            insertRes: 'format error'
          });
          return;
        }

        insertLeave.begin_date = moment(insertLeave.begin_date).format('YYYY-MM-DD');
        insertLeave.end_date = moment(insertLeave.end_date).format('YYYY-MM-DD');
        if (req.session.user.adminRight) {
          let positiveReg = /^[0-9]+$/;
          insertLeave.employee_id = Number(insertLeave.employee_id);
          insertLeave.approve_status = Boolean(insertLeave.approve_status);
          if (!positiveReg.test(insertLeave.employee_id) || typeof insertLeave.approve_reason !== 'string') {
            res.json({
              insertRes: 'format error'
            });
            return;
          }
          let insertRes = await controller.insertLeave(insertLeave.employee_id, insertLeave.leave_type, insertLeave.leave_reason, insertLeave.begin_date, insertLeave.end_date, insertLeave.submit_status, insertLeave.approve_reason, insertLeave.approve_status);
          let log_type = insertLeave.submit_status ? 'submit_leave' : 'save_leave';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: insertLeave,
            res: insertRes
          }));
          res.json({
            insertRes: insertRes
          });
        } else {
          let leaveRes = await controller.insertLeaveByEmployee(req.session.user.id, insertLeave.leave_type, insertLeave.leave_reason, insertLeave.begin_date, insertLeave.end_date, insertLeave.submit_status);
          let log_type = insertLeave.submit_status ? 'submit_leave' : 'save_leave';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: insertLeave,
            res: leaveRes
          }));
          res.json({
            insertRes: leaveRes
          });
        }
      }
    })
    .put(temp_router_url + '/:id', async (req, res) => {
      // general: id, leave_type, leave_reason, begin_date, end_date, submit_status
      // admin: employee_id, approve_reason, approve_status
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        let updateID = Number(req.params.id);
        let positiveReg = /^[0-9]+$/;
        let updateLeave = req.body;
        updateLeave.id = updateID;
        updateLeave.begin_date = new Date(updateLeave.begin_date);
        updateLeave.end_date = new Date(updateLeave.end_date);
        if (updateLeave.submit_status === 'true' || updateLeave.submit_status === true) {
          updateLeave.submit_status = true;
        } else {
          updateLeave.submit_status = false;
        }

        if (!positiveReg.test(updateID) || setting.LEAVE_TYPE.indexOf(updateLeave.leave_type) === -1 || typeof updateLeave.leave_reason !== 'string' || updateLeave.begin_date.toString() === 'Invalid Date' || updateLeave.end_date.toString() === 'Invalid Date') {
          res.json({
            updateRes: 'format error'
          });
          return;
        }

        updateLeave.begin_date = moment(updateLeave.begin_date).format('YYYY-MM-DD');
        updateLeave.end_date = moment(updateLeave.end_date).format('YYYY-MM-DD');
        if (req.session.user.adminRight === true) {
          updateLeave.employee_id = Number(updateLeave.employee_id);
          if (updateLeave.approve_status === 'true' || updateLeave.approve_status === true) {
            updateLeave.approve_status = true;
          } else {
            updateLeave.approve_status = false;
          }
          if (!positiveReg.test(updateLeave.employee_id) || typeof updateLeave.approve_reason !== 'string') {
            res.json({
              updateRes: 'format error'
            });
            return;
          }
          let updateRes = await controller.updateLeave(updateID, updateLeave.employee_id, updateLeave.leave_type, updateLeave.leave_reason, updateLeave.begin_date, updateLeave.end_date, updateLeave.submit_status, updateLeave.approve_reason, updateLeave.approve_status);
          let log_type = updateLeave.submit_status ? 'submit_leave' : 'save_leave';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: updateLeave,
            res: updateRes
          }));
          res.json({
            updateRes: updateRes
          });
        } else {
          updateLeave.employee_id = req.session.user.id;
          let updateRes = await controller.updateLeaveByEmployee(updateID, updateLeave.employee_id, updateLeave.leave_type, updateLeave.leave_reason, updateLeave.begin_date, updateLeave.end_date, updateLeave.submit_status);
          let log_type = updateLeave.submit_status ? 'submit_leave' : 'save_leave';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: updateLeave,
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
        let updateLeave = req.body;
        updateLeave.id = updateID;
        if (updateLeave.approve_status === 'true' || updateLeave.approve_status === true) {
          updateLeave.approve_status = true;
        } else {
          updateLeave.approve_status = false;
        }
        if (!positiveReg.test(updateID) || typeof updateLeave.approve_reason !== 'string') {
          res.json({
            updateRes: 'format error'
          });
          return;
        }
        let targetLeave = await controller.getLeaveByID(updateID);
        if (targetLeave.length === 0 || Boolean(targetLeave[0].submit_status) !== true || Boolean(targetLeave[0].approve_status) === true) {
          res.json({
            updateRes: 'approve leave target error'
          });
          return;
        }
        targetLeave = targetLeave[0];
        let targetEmployee = await employee_controller.getIdentityByID(targetLeave.employee_id);
        let approveRight = false;
        if (req.session.user.adminRight === true) {
          approveRight = true;
        } else {
          // cannot approve oneself
          if (targetEmployee.id === req.session.user.id) {
            res.json({
              updateRes: 'cannot approve own leave'
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
          let updateRes = await controller.approveLeave(updateID, updateLeave.approve_reason, updateLeave.approve_status);
          let log_type = updateLeave.approve_status ? 'approve_leave' : 'reject_leave';
          log.insertLog(req.session.user.id, log_type, JSON.stringify({
            req: updateLeave,
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
      // general: id, leave_type, leave_reason, begin_date, end_date, submit_status
      // admin: employee_id, approve_reason, approve_status
      if (req.session.isLogin !== true) {
        res.json({
          deleteRes: 'identity error'
        });
      } else {
        let deleteID = Number(req.params.id);
        let targetLeave = await controller.getLeaveByID(deleteID);
        if (targetLeave.length === 0) {
          res.json({
            deleteRes: 'delete leave target error'
          });
          return;
        }
        targetLeave = targetLeave[0];
        if (req.session.user.adminRight !== true) {
          if (targetLeave.employee_id !== req.session.user.id || Boolean(targetLeave.submit_status) === true || Boolean(targetLeave.approve_status) === true) {
            res.json({
              deleteRes: 'right error'
            });
            return;
          }
          // own
          let deleteRes = await controller.deleteLeaves([deleteID]);
          log.insertLog(req.session.user.id, 'delete_leave', JSON.stringify({
            req: deleteID,
            res: deleteRes
          }));
          res.json({
            deleteRes: deleteRes
          });
        } else {
          // admin
          let deleteRes = await controller.deleteLeaves([deleteID]);
          log.insertLog(req.session.user.id, 'delete_leave', JSON.stringify({
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