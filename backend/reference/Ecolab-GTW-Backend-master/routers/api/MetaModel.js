let express = require('express');
let router = express.Router();
let AdministratorController = require('../../controllers/Administrator');
let MetaModelController = require('../../controllers/MetaModel');

router.route('/api/MetaModel')
  .get(async (req, res) => {
    // response specific meta model
    MetaModelController.getAllMetaData().then(result => {
      console.log(JSON.stringify(result));
      res.send({
        status: true,
        info: result
      });
    });
    // no need to check right
    // let domainName = req.connection.user;
    // let adminRight = await AdministratorController.checkAdminRight(domainName);
    // if (adminRight) {
    //   // response specific meta model
    //   MetaModelController.getAllMetaData().then(result => {
    //     console.log(JSON.stringify(result));
    //     res.send({
    //       status: true,
    //       info: result
    //     });
    //   });
    // } else {
    //   // no admin right
    //   res.send({
    //     status: false,
    //     info: 'no admin right'
    //   });
    // }
  })
;

// /api/MetaModel/:metaModelName: get post, only for admin
router.route('/api/MetaModel/:metaModelName')
  .get(async (req, res) => {
    let metaModelName = req.params.metaModelName;
    let domainName = req.connection.user;
    let adminRight = await AdministratorController.checkAdminRight(domainName);
    let isLegalModelName = MetaModelController.isLegalMetaModelName(metaModelName);
    if (adminRight && isLegalModelName) {
      // response specific meta model
      let metaResult = {};
      MetaModelController.getMetaDataByModelName(metaModelName, metaResult).then(result => {
        console.log(JSON.stringify(result));
        res.send({
          status: true,
          info: metaResult
        });
      });
    } else if (adminRight) {
      // illegal meta model name
      res.send({
        status: false,
        info: 'illegal meta model name'
      });
    } else {
      // no admin right
      res.send({
        status: false,
        info: 'no admin right'
      });
    }
  })
  .post(async (req, res) => {
    let metaModelName = req.params.metaModelName;
    let domainName = req.connection.user;
    let adminRight = await AdministratorController.checkAdminRight(domainName);
    let isLegalModelName = MetaModelController.isLegalMetaModelName(metaModelName);
    if (adminRight && isLegalModelName) {
      // response specific meta model
      let newMetaData = req.body;
      MetaModelController.createMetaData(metaModelName, newMetaData).then(result => {
        if (result) {
          res.send({
            status: true,
            info: 'create ' + metaModelName + ' success'
          });
        } else {
          res.send({
            status: false,
            info: 'create ' + metaModelName + ' err'
          });
        }
      });
    } else if (adminRight) {
      // illegal meta model name
      res.send({
        status: false,
        info: 'illegal meta model name: ' + metaModelName
      });
    } else {
      // no admin right
      res.send({
        status: false,
        info: 'no admin right'
      });
    }
  })
;

// /api/MetaModel/:metaModelName/:ID: get put delete, only for admin
router.route('/api/MetaModel/:metaModelName/:ID')
  .get(async (req, res) => {
    let metaModelName = req.params.metaModelName;
    let dataID = req.params.ID;
    let domainName = req.connection.user;
    let adminRight = await AdministratorController.checkAdminRight(domainName);
    let isLegalModelName = MetaModelController.isLegalMetaModelName(metaModelName);
    if (adminRight && isLegalModelName) {
      // response specific meta model
      MetaModelController.getMetaDataByModelNameAndID(metaModelName, dataID).then(result => {
        console.log(JSON.stringify(result));
        res.send({
          status: true,
          info: result
        });
      });
    } else if (adminRight) {
      // illegal meta model name
      res.send({
        status: false,
        info: 'illegal meta model name'
      });
    } else {
      // no admin right
      res.send({
        status: false,
        info: 'no admin right'
      });
    }
  })
  .put(async (req, res) => {
    let metaModelName = req.params.metaModelName;
    let domainName = req.connection.user;
    let adminRight = await AdministratorController.checkAdminRight(domainName);
    let isLegalModelName = MetaModelController.isLegalMetaModelName(metaModelName);
    if (adminRight && isLegalModelName) {
      // response specific meta model, filter ID first
      let updatedMetaData = req.body;
      let updatedMetaDataID = req.params.ID;
      updatedMetaData.ID = updatedMetaDataID;
      MetaModelController.updateMetaModelByID(metaModelName, updatedMetaData).then(result => {
        if (result) {
          res.send({
            status: true,
            info: 'update ' + metaModelName + ' ID: ' + updatedMetaDataID + ' success'
          });
        } else {
          res.send({
            status: false,
            info: 'update ' + metaModelName + ' ID: ' + updatedMetaDataID + ' err'
          });
        }
      });
    } else if (adminRight) {
      // illegal meta model name
      res.send({
        status: false,
        info: 'illegal meta model name: ' + metaModelName
      });
    } else {
      // no admin right
      res.send({
        status: false,
        info: 'no admin right'
      });
    }
  })
  .delete(async (req, res) => {
    let metaModelName = req.params.metaModelName;
    let domainName = req.connection.user;
    let adminRight = await AdministratorController.checkAdminRight(domainName);
    let isLegalModelName = MetaModelController.isLegalMetaModelName(metaModelName);
    if (adminRight && isLegalModelName) {
      // response specific meta model
      let deletedMetaDataID = req.params.ID;
      MetaModelController.deleteMetaModelByID(metaModelName, deletedMetaDataID).then(result => {
        if (result) {
          res.send({
            status: true,
            info: 'delete ' + metaModelName + ' ID: ' + deletedMetaDataID + ' success'
          });
        } else {
          res.send({
            status: false,
            info: 'delete ' + metaModelName + ' ID: ' + deletedMetaDataID + ' err'
          });
        }
      });
    } else if (adminRight) {
      // illegal meta model name
      res.send({
        status: false,
        info: 'illegal meta model name: ' + metaModelName
      });
    } else {
      // no admin right
      res.send({
        status: false,
        info: 'no admin right'
      });
    }
  })
;


let MetaModelRouter = function (app) {
  app.use(router)
}

module.exports = MetaModelRouter;