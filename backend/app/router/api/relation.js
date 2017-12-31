let parse_router = require('../../util/parse_router');

let controller = require('../../controller/api/relation');
let employee_controller = require('../../controller/api/employee');
let log = require('../../controller/api/log');

let Router = function (router, absolute_path) {
  let temp_router_url = parse_router(absolute_path);
  // /api/relation
  router
    .post(temp_router_url + '/assign/belong', async (req, res) => {
      // only for admin and personnel
      if (req.session.isLogin !== true) {
        res.json({
          res: 'identity error'
        });
      } else if (req.session.user.adminRight || req.session.user.personnelRight) {
        let positiveReg = /^[0-9]+$/;
        let assignReq = req.body;
        let employee_id = assignReq.employee_id;
        let department_id = assignReq.department_id;
        if (!positiveReg.test(employee_id) || !positiveReg.test(department_id)) {
          res.json({
            res: 'format error'
          });
        } else {
          if (req.session.user.adminRight) {
            // assign by administrator
            let targetEmployee = await employee_controller.getIdentityByID(employee_id);
            let result = {};
            result.dismissRes = await controller.dismissEmployeeByAdministrator(targetEmployee);
            log.insertLog(req.session.user.id, 'dismiss_employee', JSON.stringify(targetEmployee));
            result.assignRes = await controller.assignEmployeeToDepartment(employee_id, department_id);
            log.insertLog(req.session.user.id, 'assign_belong', JSON.stringify({
              req: assignReq,
              res: result
            }));
            res.json({
              res: result
            });
          } else {
            // assign by personnel
            let targetEmployee = await employee_controller.getIdentityByID(employee_id);
            let result = {};
            result.dismissRes = await controller.dismissEmployeeByPersonnel(targetEmployee);
            log.insertLog(req.session.user.id, 'dismiss_employee', JSON.stringify(targetEmployee));
            if (result.dismissRes === false) {
              res.json({
                res: 'right error'
              });
            } else {
              result.assignRes = await controller.assignEmployeeToDepartment(employee_id, department_id);
              log.insertLog(req.session.user.id, 'assign_belong', JSON.stringify({
                req: assignReq,
                res: result
              }));
              res.json({
                res: result
              });
            }
          }
        }
      } else {
        res.json({
          res: 'right error'
        });
      }
    })
    .post(temp_router_url + '/assign/head', async (req, res) => {
      // only for admin and personnel
      if (req.session.isLogin !== true) {
        res.json({
          res: 'identity error'
        });
      } else if (req.session.user.adminRight || req.session.user.personnelRight) {
        let positiveReg = /^[0-9]+$/;
        let assignReq = req.body;
        let employee_id = assignReq.employee_id;
        let department_id = assignReq.department_id;
        if (!positiveReg.test(employee_id) || !positiveReg.test(department_id)) {
          res.json({
            res: 'format error'
          });
        } else {
          if (req.session.user.adminRight) {
            // assign by administrator
            let targetEmployee = await employee_controller.getIdentityByID(employee_id);
            let result = {};
            result.dismissRes = await controller.dismissEmployeeByAdministrator(targetEmployee);
            log.insertLog(req.session.user.id, 'dismiss_employee', JSON.stringify(targetEmployee));
            result.assignRes = await controller.assignHeadToDepartment(employee_id, department_id);
            log.insertLog(req.session.user.id, 'assign_head', JSON.stringify({
              req: assignReq,
              res: result
            }));
            res.json({
              res: result
            });
          } else {
            // assign by personnel
            let targetEmployee = await employee_controller.getIdentityByID(employee_id);
            let result = {};
            result.dismissRes = await controller.dismissEmployeeByPersonnel(targetEmployee);
            log.insertLog(req.session.user.id, 'dismiss_employee', JSON.stringify(targetEmployee));
            if (result.dismissRes === false) {
              res.json({
                res: 'right error'
              });
            } else {
              result.assignRes = await controller.assignHeadToDepartment(employee_id, department_id);
              log.insertLog(req.session.user.id, 'assign_head', JSON.stringify({
                req: assignReq,
                res: result
              }));
              res.json({
                res: result
              });
            }
          }
        }
      } else {
        res.json({
          res: 'right error'
        });
      }
    })
    .post(temp_router_url + '/assign/personnel', async (req, res) => {
      // only for admin
      if (req.session.isLogin !== true) {
        res.json({
          res: 'identity error'
        });
      } else if (req.session.user.adminRight) {
        let positiveReg = /^[0-9]+$/;
        let assignReq = req.body;
        let employee_id = assignReq.employee_id;
        if (!positiveReg.test(employee_id)) {
          res.json({
            res: 'format error'
          });
        } else {
          // assign by administrator
          let targetEmployee = await employee_controller.getIdentityByID(employee_id);
          let result = {};
          result.dismissRes = await controller.dismissEmployeeByAdministrator(targetEmployee);
          log.insertLog(req.session.user.id, 'dismiss_employee', JSON.stringify(targetEmployee));
          result.assignRes = await controller.assignPersonnel(employee_id);
          log.insertLog(req.session.user.id, 'assign_personnel', JSON.stringify({
            req: assignReq,
            res: result
          }));
          res.json({
            res: result
          });
        }
      } else {
        res.json({
          res: 'right error'
        });
      }
    })
    .post(temp_router_url + '/assign/administrator', async (req, res) => {
      // only for admin
      if (req.session.isLogin !== true) {
        res.json({
          res: 'identity error'
        });
      } else if (req.session.user.adminRight) {
        let positiveReg = /^[0-9]+$/;
        let assignReq = req.body;
        let employee_id = assignReq.employee_id;
        if (!positiveReg.test(employee_id)) {
          res.json({
            res: 'format error'
          });
        } else {
          // assign by administrator
          let targetEmployee = await employee_controller.getIdentityByID(employee_id);
          let result = {};
          result.dismissRes = await controller.dismissEmployeeByAdministrator(targetEmployee);
          log.insertLog(req.session.user.id, 'dismiss_employee', JSON.stringify(targetEmployee));
          result.assignRes = await controller.assignAdministrator(employee_id);
          log.insertLog(req.session.user.id, 'assign_administrator', JSON.stringify({
            req: assignReq,
            res: result
          }));
          res.json({
            res: result
          });
        }
      } else {
        res.json({
          res: 'right error'
        });
      }
    })
    .post(temp_router_url + '/dismiss', async (req, res) => {
      // only for admin and personnel
      if (req.session.isLogin !== true) {
        res.json({
          res: 'identity error'
        });
      } else if (req.session.user.adminRight || req.session.user.personnelRight) {
        let positiveReg = /^[0-9]+$/;
        let assignReq = req.body;
        let employee_id = assignReq.employee_id;
        if (!positiveReg.test(employee_id)) {
          res.json({
            res: 'format error'
          });
        } else {
          if (req.session.user.adminRight) {
            // dismiss by administrator
            let targetEmployee = await employee_controller.getIdentityByID(employee_id);
            let result = {};
            result.dismissRes = await controller.dismissEmployeeByAdministrator(targetEmployee);
            log.insertLog(req.session.user.id, 'dismiss_employee', JSON.stringify(targetEmployee));
            res.json({
              res: result
            });
          } else {
            // dismiss by personnel
            let targetEmployee = await employee_controller.getIdentityByID(employee_id);
            let result = {};
            result.dismissRes = await controller.dismissEmployeeByPersonnel(targetEmployee);
            log.insertLog(req.session.user.id, 'dismiss_employee', JSON.stringify(targetEmployee));
            if (result.dismissRes === false) {
              res.json({
                res: 'right error'
              });
            } else {
              res.json({
                res: result
              });
            }
          }
        }
      } else {
        res.json({
          res: 'right error'
        });
      }
    })
  // .post(temp_router_url + '/dismiss/head', async (req, res) => {
  //
  // })
  // .post(temp_router_url + '/dismiss/personnel', async (req, res) => {
  //
  // })
  // .post(temp_router_url + '/dismiss/administrator', async (req, res) => {
  //
  // })
}


module.exports = Router;