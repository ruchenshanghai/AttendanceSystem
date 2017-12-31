let parse_router = require('../../util/parse_router');

let controller = require('../../controller/api/department');
let log = require('../../controller/api/log');

let Router = function (router, absolute_path) {
  let temp_router_url = parse_router(absolute_path);
  // /api/department
  router
    .get(temp_router_url, async (req, res) => {
      // get all departments
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight === true || req.session.user.personnelRight === true) {
          // get all checks from log
          let getRes = await controller.getAllDepartments();
          res.json({
            getRes: getRes
          })
        } else {
          res.json({
            getRes: 'right error'
          });
        }
      }
    })
    .post(temp_router_url, async (req, res) => {
      // only for admin and personnel
      if (req.session.isLogin !== true) {
        res.json({
          insertRes: 'identity error'
        });
      } else if ((req.session.user.personnelRight || req.session.user.adminRight)) {
        let insertDepartment = req.body;
        if (insertDepartment.name == '' || insertDepartment.code == '') {
          res.json({
            insertRes: 'format error'
          });
        } else {
          let insertRes = await controller.insertDepartment(insertDepartment.name, insertDepartment.code);
          insertDepartment.res = insertRes;
          log.insertLog(req.session.user.id, 'add_department', JSON.stringify(insertDepartment));
          res.json({
            inserRes: insertRes
          });
        }
      } else {
        res.json({
          insertRes: 'right error'
        });
      }
    })
    .put(temp_router_url + '/:id', async (req, res) => {
      // only for admin and personnel
      if (req.session.isLogin !== true) {
        res.json({
          updateRes: 'identity error'
        });
      } else if (req.session.user.adminRight === true || req.session.user.personnelRight === true) {
        let updateID = Number(req.params.id);
        let updateDepartment = req.body;
        let positiveReg = /^[0-9]+$/;
        try {
          if (updateID !== updateDepartment.id || !positiveReg.test(updateDepartment.id) || updateDepartment.name == '' || updateDepartment.code == '') {
            res.json({
              updateRes: 'format error'
            });
          } else {
            // need update
            let updateRes = await controller.updateDepartment(updateDepartment.id, updateDepartment.name, updateDepartment.code);
            updateDepartment.res = updateRes;
            log.insertLog(req.session.user.id, 'modify_department', JSON.stringify(updateDepartment));
            res.json({
              updateRes: updateRes
            });
          }
        } catch (err) {
          console.log(JSON.stringify(err));
          res.json({
            updateRes: err
          });
        }
      } else {
        res.json({
          updateRes: 'right error'
        });
      }
    })
    .delete(temp_router_url + '/:id', async (req, res) => {
      let deleteID = Number(req.params.id);
      if (req.session.isLogin !== true) {
        res.json({
          deleteRes: 'identity error'
        });
      } else {
        if (req.session.user.adminRight || req.session.user.personnelRight) {
          let deleteID = req.params.id;
          let positiveReg = /^[0-9]+$/;
          if (!positiveReg.test(deleteID)) {
            res.json({
              deleteRes: 'format error'
            });
          } else {
            let deleteRes = await controller.deleteDepartmentByID(deleteID);
            let logObj = {
              id: deleteID,
              res: deleteRes
            }
            log.insertLog(req.session.user.id, 'del_department', JSON.stringify(logObj));
            res.json({
              deleteRes: deleteRes
            });
          }
        }
      }
    })


  // .post(temp_router_url, async (req, res) => {
  //
  //
  // })

  // .post(temp_router_url + '/OUT', async (req, res) => {
  //   // only for admin, delete logs array
  //   if (req.session.isLogin !== true) {
  //     res.json({
  //       checkInRes: 'identity error'
  //     });
  //   } else {
  //     let checkOutRes = await controller.checkOut(req.session.user.id);
  //     log.insertLog(req.session.user.id, 'checkout', JSON.stringify(checkOutRes));
  //     console.log(JSON.stringify(checkOutRes));
  //     res.json({
  //       checkOutRes: checkOutRes
  //     });
  //   }
  // })
}


module.exports = Router;