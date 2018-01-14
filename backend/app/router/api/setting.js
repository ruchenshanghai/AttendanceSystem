let parse_router = require('../../util/parse_router');

let controller = require('../../controller/api/setting');
let log = require('../../controller/api/log');

let Router = function (router, absolute_path) {
  let temp_router_url = parse_router(absolute_path);
  // /api/setting
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
        let allSettings = await controller.getAllSettings();
        res.json({
          getRes: allSettings
        });
      }
    })
    .put(temp_router_url + '/:id', async (req, res) => {
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
        let updateSetting = req.body;
        updateSetting.id = updateID;
        if (!positiveReg.test(updateID) || updateSetting.id == '' || updateSetting.name == '' || updateSetting.value == '') {
          res.json({
            updateRes: 'format error'
          });
        } else {
          let updateRes = await controller.updateSettingByID(updateSetting);
          updateSetting.res = updateRes;
          log.insertLog(req.session.user.id, 'modify_setting', JSON.stringify(updateSetting));
          res.json({
            updateRes: updateRes
          });
        }
      }
    })
}


module.exports = Router;