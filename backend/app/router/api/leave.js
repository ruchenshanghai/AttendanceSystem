let parse_router = require('../../util/parse_router');

let controller = require('../../controller/api/leave');
let log = require('../../controller/api/log');
// let setting = require('../../controller/api/setting');

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
  // .post(temp_router_url + '/IN', async (req, res) => {
  //   // only for admin, delete logs array
  //   if (req.session.isLogin !== true) {
  //     res.json({
  //       checkInRes: 'identity error'
  //     });
  //   } else {
  //     let checkInRes = await controller.checkIn(req.session.user.id);
  //     log.insertLog(req.session.user.id, 'checkin', JSON.stringify(checkInRes));
  //     console.log(JSON.stringify(checkInRes));
  //     res.json({
  //       checkInRes: checkInRes
  //     });
  //   }
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


  // .post(temp_router_url, async (req, res) => {
  //   if (req.session.isLogin !== true) {
  //     res.json({
  //       insertRes: 'identity error'
  //     });
  //   } else {
  //     if (req.session.user.adminRight === true) {
  //       let insertCheck = req.body;
  //       let positiveReg = /^[0-9]+$/;
  //       try {
  //         let check_datetime = new Date(insertCheck.check_datetime);
  //         if (!positiveReg.test(insertCheck.employee_id) || (insertCheck.check_type !== 'IN' && insertCheck.check_type !== 'OUT') || check_datetime.toString() === 'Invalid Date') {
  //           res.json({
  //             insertRes: 'format error'
  //           });
  //         } else {
  //           // need check
  //           if (insertCheck.check_type === 'IN') {
  //             let checkInRes = await controller.checkInSpecifiedDatetime(insertCheck.employee_id, check_datetime);
  //             log.insertLog(req.session.user.id, 'checkin', JSON.stringify({
  //               req: insertCheck,
  //               res: checkInRes
  //             }));
  //             console.log(JSON.stringify(checkInRes));
  //             res.json({
  //               insertRes: checkInRes
  //             });
  //           } else {
  //             let checkOutRes = await controller.checkOutSpecifiedDatetime(insertCheck.employee_id, check_datetime);
  //             log.insertLog(req.session.user.id, 'checkout', JSON.stringify({
  //               req: insertCheck,
  //               res: checkOutRes
  //             }));
  //             console.log(JSON.stringify(checkOutRes));
  //             res.json({
  //               insertRes: checkOutRes
  //             });
  //           }
  //         }
  //       } catch (err) {
  //         console.log(JSON.stringify(err));
  //         res.json({
  //           insertRes: err
  //         });
  //       }
  //     } else {
  //       res.json({
  //         insertRes: 'right error'
  //       });
  //     }
  //   }
  // })
  // .put(temp_router_url + '/:id', async (req, res) => {
  //   if (req.session.isLogin !== true) {
  //     res.json({
  //       getRes: 'identity error'
  //     });
  //   } else {
  //     if (req.session.user.adminRight === true) {
  //       let updateID = Number(req.params.id);
  //       let updateCheck = req.body;
  //       updateCheck.check_in_status = Boolean(updateCheck.check_in_status);
  //       updateCheck.check_out_status = Boolean(updateCheck.check_out_status);
  //       let positiveReg = /^[0-9]+$/;
  //       try {
  //         updateCheck.check_in_datetime = new Date(updateCheck.check_in_datetime);
  //         updateCheck.check_out_datetime = new Date(updateCheck.check_out_datetime);
  //         if (updateID !== updateCheck.id || !positiveReg.test(updateCheck.id) || !positiveReg.test(updateCheck.employee_id) || updateCheck.check_in_datetime.toString() === 'Invalid Date' || updateCheck.check_out_datetime.toString() === 'Invalid Date') {
  //           res.json({
  //             insertRes: 'format error'
  //           });
  //         } else {
  //           // need insert
  //           let updateRes = await controller.updateCheck(updateCheck.id, updateCheck.employee_id, updateCheck.check_in_datetime, updateCheck.check_in_status, updateCheck.check_out_datetime, updateCheck.check_out_status);
  //           // updateCheck.res = updateRes; err sql \" "
  //           log.insertLog(req.session.user.id, 'modify_check', JSON.stringify(updateCheck));
  //           res.json({
  //             insertRes: updateRes
  //           });
  //         }
  //       } catch (err) {
  //         console.log(JSON.stringify(err));
  //         res.json({
  //           insertRes: err
  //         });
  //       }
  //     } else {
  //       res.json({
  //         getRes: 'right error'
  //       });
  //     }
  //   }
  // })
  // .delete(temp_router_url, async (req, res) => {
  //   if (req.session.isLogin !== true) {
  //     res.json({
  //       getRes: 'identity error'
  //     });
  //   } else {
  //     if (req.session.user.adminRight === true) {
  //       let deleteArray = req.body;
  //       let positiveReg = /^[0-9]+$/;
  //       for (let index in deleteArray) {
  //         deleteArray[index] = Number(deleteArray[index]);
  //         if (!positiveReg.test(deleteArray[index])) {
  //           res.json({
  //             deleteRes: 'format error'
  //           });
  //           return;
  //         }
  //       }
  //       deleteArray = Array.from(new Set(deleteArray));
  //       let deleteRes = await controller.deleteChecks(deleteArray);
  //       let logObj = {
  //         id: deleteArray,
  //         res: deleteRes
  //       };
  //       log.insertLog(req.session.user.id, 'delete_check', JSON.stringify(logObj));
  //       res.json({
  //         deleteRes: deleteRes
  //       });
  //     } else {
  //       res.json({
  //         getRes: 'right error'
  //       });
  //     }
  //   }
  // })
}


module.exports = Router;