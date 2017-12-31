let config = require('../config');
let InitialConnect = require('../utils/database/initial-connect');
let MainDataModel = require('../utils/database/models/MainData');
let ReviewerController = require('./Reviewer');
let AdministratorController = require('./Administrator')

const moment = require('moment');
const opportunityCodePrefix = '6000-';
const MainDataBriefAttributes = ['ID', 'ChineseName', 'OpportunityCode', 'AnnualSales', 'Currency', 'SalesRep', 'Reviewer', 'UpdateDate',
  'UpdateUser', 'PipelineStatus', 'TargetRate', 'FollowingStatus', 'MarketClassification', 'SalesType', 'RecordOwner', 'CheckedUsers'];


let MainDataController = {}


MainDataController.getMainDataList = async function (domainName, attributes) {
  let adminRight = await AdministratorController.checkAdminRight(domainName);
  let queryConfig = {};
  queryConfig.attributes = attributes;
  if (!adminRight) {
    let tempReviewer = await ReviewerController.getReviewerByDomainName(domainName);
    queryConfig.where = {
      $or: [
        {Reviewer: tempReviewer.DisplayName},
        {RecordOwner: domainName}
      ]
    }
  }
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = MainDataModel(tempConnect);
    tempModel.findAll(queryConfig).then(result => {
      console.log('db find main data list, length: ' + result.length);
      resolve(result);
    }).catch(err => {
      console.log('db find main data list err' + JSON.stringify(err));
      resolve(null);
    });
  });
}

MainDataController.getTargetIDArrayMainDataList = async function (domainName, attributes, IDArray) {
  let adminRight = await AdministratorController.checkAdminRight(domainName);
  let queryConfig = {};
  queryConfig.attributes = attributes;
  if (!adminRight) {
    let tempReviewer = await ReviewerController.getReviewerByDomainName(domainName);
    queryConfig.where = {
      $and: [
        {
          $or: [
            {Reviewer: tempReviewer.DisplayName},
            {RecordOwner: domainName}
          ]
        },
        {
          ID: {
            $in: IDArray
          }
        }
      ]
    };
  } else {
    queryConfig.where = {
      ID: {
        $in: IDArray
      }
    };
  }
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = MainDataModel(tempConnect);
    tempModel.findAll(queryConfig).then(result => {
      console.log('db find main data list, length: ' + result.length);
      resolve(result);
    }).catch(err => {
      console.log('db find main data list err' + JSON.stringify(err));
      resolve(null);
    });
  });
}

MainDataController.getMainDataByChineseNameAndAnnualSales = async function (newMainData) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = MainDataModel(tempConnect);
    // tempModel.find
    tempModel.findAll({
      attributes: ['SalesRep'],
      where: {
        $and: [
          {ChineseName: newMainData.ChineseName},
          {AnnualSales: newMainData.AnnualSales}
        ]
      }
    }).then(result => {
      console.log('similar record length: ' + result.length);
      let tempArray = null;
      if (result.length > 0) {
        tempArray = [];
        for (let index = 0; index < result.length; index++) {
          if (tempArray.indexOf(result[index].SalesRep) === -1) {
            tempArray.push(result[index].SalesRep);
          }
        }
      }
      resolve(tempArray);
    }).catch(err => {
      console.log('db find similar err: ' + JSON.stringify(err));
      resolve(null);
    });
  });
}

MainDataController.getMainDataByID = async function (mainDataID) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = MainDataModel(tempConnect);
    tempModel.findById(mainDataID).then(result => {
      console.log('db find main data by ID: ' + JSON.stringify(result));
      resolve(result);
    }).catch(err => {
      console.log('db find main data by ID err' + JSON.stringify(err));
      resolve(null);
    });
  });
}

MainDataController.generateOpportunityCode = async function () {
  return new Promise((resolve, reject) => {
    let tempOpportunityPrefix = opportunityCodePrefix + moment().format('YYYYMMDD') + '-';
    console.log('target OpportunityCode prefix: ' + tempOpportunityPrefix);
    let tempConnect = InitialConnect(config);
    const Op = require('sequelize').Op;
    let tempModel = MainDataModel(tempConnect);
    tempModel.count({
      where: {
        OpportunityCode: {
          [Op.like]: tempOpportunityPrefix + '%'
        }
      }
    }).then(resNum => {
      console.log('the same day previous data num: ' + resNum);
      console.log('current opportunity code: ' + tempOpportunityPrefix + (resNum + 1));
      resolve(tempOpportunityPrefix + (resNum + 1));
    }).catch(err => {
      console.log('db generate opportunity code err: ' + JSON.stringify(err));
    });
  });
}

MainDataController.createMainData = async function (newMainData) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = MainDataModel(tempConnect);
    newMainData.UpdateDate = moment().format('YYYY-MM-DD');
    tempModel.create(newMainData).then(res => {
      console.log('db success create mainData ' + JSON.stringify(res));
      resolve(res.ID);
    }).catch(err => {
      console.log('db create mainData err: ' + JSON.stringify(err));
      resolve(false);
    });
  });
}

MainDataController.updateMainData = async function (updatedMainData) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = MainDataModel(tempConnect);
    updatedMainData.UpdateDate = moment().format('YYYY-MM-DD');
    tempModel.update(updatedMainData,
      {
        where: {
          ID: updatedMainData.ID
        }
      }).then(count => {
      console.log('db update mainData count: ' + count.length);
      if (count.length === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch(err => {
      console.log('db update mainData err: ' + JSON.stringify(err));
      resolve(false);
    })
  });
}

MainDataController.transferReviewer = async function (fromName, toName) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = MainDataModel(tempConnect);
    tempModel.update({
        Reviewer: toName
      },
      {
        where: {
          Reviewer: fromName
        }
      }).then(count => {
      console.log('db update mainData count: ' + count[0]);
      resolve(count[0]);
    }).catch(err => {
      console.log('db update mainData err: ' + JSON.stringify(err));
      resolve(false);
    })
  });
}

MainDataController.deleteMainData = async function (deleteMainDataID) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = MainDataModel(tempConnect);
    tempModel.destroy(
      {
        where: {
          ID: deleteMainDataID
        }
      }).then(count => {
      console.log('db delete mainData count: ' + count);
      if (count === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
      resolve(true);
    }).catch(err => {
      console.log('db delete mainData err: ' + JSON.stringify(err));
      resolve(false);
    })
  });
}

module.exports = MainDataController;