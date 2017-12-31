const express = require('express');
let router = express.Router();
let AdministratorController = require('../controllers/Administrator');
let MainDataController = require('../controllers/MainData');
// let MetaModelController = require('../controllers/MetaModel');
// let ReviewerController = require('../controllers/Reviewer');

let filterIDArray = function (IDArray) {
  if (!Array.isArray(IDArray)) {
    return null;
  }
  let tempIDArray = Array.from(new Set(IDArray));
  for (let i = 0; i < tempIDArray.length; i++) {
    if (!Number.isInteger(tempIDArray[i])) {
      return null;
    }
  }
  return tempIDArray;
}

let checkIDArray = function (IDArray) {
  if (!Array.isArray(IDArray)) {
    return false;
  }
  IDArray = Array.from(new Set(IDArray));
  for (let i = 0; i < IDArray.length; i++) {
    if (!Number.isInteger(IDArray[i])) {
      return false;
    }
  }
  return true;
}

router.get('/api/DomainName', function (req, res) {
  let domainName = req.connection.user;
  res.send({
    status: true,
    info: {
      domainName: domainName
    }
  });
});

router.get('/api/AdminRight', async (req, res) => {
  let domainName = req.connection.user;
  let displayName = await AdministratorController.getDisplayNameByDomainName(domainName);
  if (displayName !== null) {
    res.send({
      status: true,
      info: {
        adminRight: true,
        displayName: displayName
      }
    });
  } else {
    res.send({
      status: true,
      info: {
        adminRight: false
      }
    });
  }

});

const MainDataDownloadAttributes = ['Reviewer', 'BUDistrict', 'OpportunityCode', 'Province', 'City', 'Site', 'ChineseName', 'EnglishName', 'PipelineStatus', 'ContractTerm', 'TargetRate', 'AnnualSales', 'Currency', 'CorporateChineseName', 'CorporateEnglishName', 'SalesRep', 'AssistCAM', 'FollowingStatus', 'CTCBU', 'CTCSales', 'SalesType', 'FollowingStatusRemark', 'CompetitorCN', 'FirstCollaborationDate', 'EstimatedPCO', 'Remark', 'MarketClassification', 'ServiceTimeRequested', 'ModifyRemark', 'RecordOwner'];

router.post('/api/Download', async (req, res) => {
  let downloadConfig = req.body;
  let domainName = req.connection.user;
  let IDArray = filterIDArray(downloadConfig.IDArray);
  if (downloadConfig.type === 'all') {
    console.log('download all data');
    let MainDataList = await MainDataController.getMainDataList(domainName, MainDataDownloadAttributes);
    res.send({
      status: true,
      info: MainDataList
    });
  } else if (downloadConfig.type === 'partial' && IDArray !== null && IDArray.length > 0) {
    console.log('download partial data');
    let MainDataList = await MainDataController.getTargetIDArrayMainDataList(domainName, MainDataDownloadAttributes, IDArray);
    res.send({
      status: true,
      info: MainDataList
    });
  } else {
    res.send({
      status: false,
      info: 'download config error'
    });
  }
});

let UtilRouter = function (app) {
  app.use(router);
}

module.exports = UtilRouter;