let parse_router = require('../../util/parse_router');

let controller = require('../../controller/api/employee');
let log = require('../../controller/api/log');

let Router = function (router, absolute_path) {
  let temp_router_url = parse_router(absolute_path);
  // /api/employee
  router
    .get(temp_router_url, async (req, res) => {
      // get all employee data
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else if (req.session.user.personnelRight || req.session.user.adminRight) {
        let allEmployees = await controller.getAllIdentity();
        console.log(JSON.stringify(allEmployees));
        if (req.session.user.personnelRight) {
          // delete password for personnel
          for (let index in allEmployees) {
            delete allEmployees[index].password;
          }
        }
        res.json({
          getRes: allEmployees
        });
      } else if (req.session.user.headRight) {
        let headEmployees = await controller.getIdentityByDepartment(req.session.user.department.id);
        // delete password for head
        for (let index in headEmployees) {
          delete headEmployees[index].password;
        }
        res.json({
          getRes: headEmployees
        });
      } else {
        res.json({
          getRes: 'right error'
        });
      }
    })
    .post(temp_router_url, async (req, res) => {
      let reqUser = req.body;
      if (req.session.isLogin !== true) {
        let resUser = await controller.checkIdentity(reqUser);
        if (resUser.id !== undefined) {
          log.insertLog(resUser.id, 'login', JSON.stringify(resUser));
          req.session.isLogin = true;
          req.session.user = resUser;
        }
        res.json({
          loginRes: resUser
        });
      } else {
        console.log('already login');
        let insertUser = reqUser;
        if ((req.session.user.personnelRight || req.session.user.adminRight) && insertUser.id === undefined) {
          // insert employee
          let insertRes = await controller.insertEmployee(insertUser);
          insertUser.res = insertRes;
          log.insertLog(req.session.user.id, 'add_user', JSON.stringify(insertUser));
          res.json({
            insertRes: insertRes
          });
        } else {
          res.json({
            loginRes: req.session.user
          });
        }
      }
    })
    .post(temp_router_url + '/OUT', async (req, res) => {
      delete req.session.user;
      res.json({
        logoutRes: 'success'
      });
    })
    .put(temp_router_url + '/:id', async (req, res) => {
      if (req.session.isLogin !== true) {
        res.json({
          updatedRes: 'identity error'
        });
      } else {
        let positiveReg = /^[0-9]+$/;
        let updateID = Number(req.params.id);
        let updateEmployee = req.body;
        if (!positiveReg.test(updateID) || updateEmployee.id !== updateID || updateEmployee.name == '') {
          res.json({
            updateRes: 'format error'
          });
        } else {
          // check update right
          let updateRight = false;
          if (req.session.user.adminRight) {
            // update by administrator
            updateRight = true;
          } else if (req.session.user.personnelRight) {
            // update by personnel
            let targetEmployee = await controller.getIdentityByID(updateEmployee.id);
            if (targetEmployee.adminRight !== true && targetEmployee.personnelRight !== true && targetEmployee.headRight !== true) {
              // update general employee by personnel
              updateRight = true;
              // cannot change password
              updateEmployee.password = targetEmployee.password;
            }
          }
          if (updateEmployee.id === req.session.user.id) {
            //update by oneself
            updateRight = true;
          }
          if (updateRight) {
            // update employee
            let updatedRes = await controller.updateEmployee(updateEmployee);
            updateEmployee.res = updatedRes;
            log.insertLog(req.session.user.id, 'modify_user', JSON.stringify(updateEmployee));
            res.json({
              updatedRes: updatedRes
            });
          } else {
            res.json({
              updatedRes: 'right error'
            });
          }
        }
      }
    })
    .delete(temp_router_url + '/:id', async (req, res) => {
      let deleteID = Number(req.params.id);
      if (req.session.isLogin !== true) {
        res.json({
          deleteRes: 'identity error'
        });
      } else {
        // check delete right
        let deleteRight = false;
        if (req.session.user.adminRight) {
          // delete by administrator
          deleteRight = true;
        } else if (req.session.user.personnelRight) {
          // delete by personnel
          let targetEmployee = await controller.getIdentityByID(deleteID);
          if (targetEmployee.adminRight !== true && targetEmployee.personnelRight !== true && targetEmployee.headRight !== true) {
            // delete general employee by personnel
            deleteRight = true;
          }
        }
        if (deleteRight) {
          // delete employee
          let deleteRes = await controller.deleteEmployeeByID(deleteID);
          let logObj = {
            id: deleteID,
            res: deleteRes
          }
          log.insertLog(req.session.user.id, 'del_user', JSON.stringify(logObj));
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
  ;
}
module.exports = Router;