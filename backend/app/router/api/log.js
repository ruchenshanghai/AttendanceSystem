let parse_router = require('../../util/parse_router');

let controller = require('../../controller/api/log');

let Router = function (router, absolute_path) {
  let temp_router_url = parse_router(absolute_path);
  // /api/log
  router
    .get(temp_router_url, async (req, res) => {
      // only for admin, get all logs
      if (req.session.isLogin !== true) {
        res.json({
          getRes: 'identity error'
        });
      } else if (req.session.user.adminRight !== true) {
        res.json({
          getRes: 'right error'
        });
      } else {
        let allLogs = await controller.getAllLogs();
        res.json({
          getRes: allLogs
        });
      }
    })
    .put(temp_router_url + '/;id', async (req, res) => {
      // only for admin, update specific log, format: id, operate_type, operate_value
      if (req.session.isLogin !== true) {
        res.json({
          updateRes: 'identity error'
        });
      } else if (req.session.user.adminRight !== true) {
        res.json({
          updateRes: 'right error'
        });
      } else {
        let positiveReg = /^[0-9]+$/;
        let updateID = Number(req.params.id);
        let updateLog = req.body;
        updateLog.id = updateID;
        if (!positiveReg.test(updateID) || updateLog.operate_type == '' || updateLog.operate_value == '') {
          res.json({
            updateRes: 'format error'
          });
        } else {
          let updateRes = await controller.updateLog(updateID, req.session.user.id, updateLog.operate_type, updateLog.operate_value);
          res.json({
            updateRes: updateRes
          });
        }
      }
    })
    .delete(temp_router_url, async (req, res) => {
      // only for admin, delete logs array
      if (req.session.isLogin !== true) {
        res.json({
          deleteRes: 'identity error'
        });
      } else if (req.session.user.adminRight !== true) {
        res.json({
          deleteRes: 'right error'
        });
      } else {
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
        let deleteRes = await controller.deleteLogs(deleteArray);
        res.json({
          deleteRes: deleteRes
        });
      }
    })
}


module.exports = Router;