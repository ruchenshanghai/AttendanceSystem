let express = require('express');
let router = express.Router();
let AdministratorController = require('../../controllers/Administrator');
let MetaModelController = require('../../controllers/MetaModel')
let MainDataController = require('../../controllers/MainData');
let ReviewerController = require('../../controllers/Reviewer');


const MainDataBriefAttributes = ['ID', 'ChineseName', 'OpportunityCode', 'AnnualSales', 'Currency', 'SalesRep', 'Reviewer', 'UpdateDate', 'UpdateUser', 'PipelineStatus', 'TargetRate', 'FollowingStatus', 'MarketClassification', 'SalesType', 'RecordOwner', 'CheckedUsers'];


let checkDeleteRight = async function (domainName, mainDataID) {
  let adminRight = await AdministratorController.checkAdminRight(domainName);
  let deleteRight = false;
  if (adminRight) {
    // modify by admin
    deleteRight = true;
  } else {
    let reviewer = await ReviewerController.getReviewerByDomainName(domainName);
    let rawMainData = await MainDataController.getMainDataByID(mainDataID);
    if (reviewer !== null && rawMainData.Reviewer === reviewer.DisplayName) {
      // limit reviewer
      deleteRight = true;
    } else if (rawMainData.RecordOwner === domainName) {
      // limit record owner
      deleteRight = true;
    }
  }
  return deleteRight;
}

let generateCheckedUsersArray = function (domainName) {
  let tempArray = [];
  tempArray.push(domainName);
  return JSON.stringify(tempArray);
}
let isCheckedUsers = function (users, domainName) {
  let index;
  let usersArray = JSON.parse(users);
  for (index = 0; index < usersArray.length; index++) {
    if (usersArray[index] === domainName) {
      return true;
    }
  }
  return false;
}
let addCheckedUsers = function (users, domainName) {
  let usersArray = JSON.parse(users);
  usersArray.push(domainName);
  return JSON.stringify(usersArray);
}

// all main data list
router.route('/api/MainData')
  .get(async (req, res) => {
    let domainName = req.connection.user;
    let adminRight = await AdministratorController.checkAdminRight(domainName);
    let resInfo = {};
    let currencyArray = await MetaModelController.getMetaDataByModelName('Currency', resInfo);
    if (currencyArray === null) {
      res.send({
        status: false,
        info: 'currency error'
      })
    }
    let mainDataArray = await MainDataController.getMainDataList(domainName, MainDataBriefAttributes);
    resInfo.MainData = mainDataArray;
    res.send({
      status: true,
      info: resInfo
    });
  })
  .post(async (req, res) => {
    let message = req.body;
    if (message.operation === 'check') {
      let similarSalesRepName = await MainDataController.getMainDataByChineseNameAndAnnualSales(message.mainData);
      console.log(JSON.stringify(similarSalesRepName));
      if (similarSalesRepName === null) {
        // no similar record
        let domainName = req.connection.user;
        let adminRight = await AdministratorController.checkAdminRight(domainName);
        let newMainData = message.mainData;
        if (!adminRight || newMainData.RecordOwner === undefined) {
          newMainData.RecordOwner = domainName;
        }
        newMainData.CheckedUsers = generateCheckedUsersArray(domainName);
        newMainData.OpportunityCode = await MainDataController.generateOpportunityCode();
        newMainData.UpdateUser = domainName;
        let createRes = await MainDataController.createMainData(newMainData);
        if (createRes !== false) {
          res.send({
            status: true,
            info: createRes
          });
        } else {
          res.send({
            status: false,
            info: {
              errType: 'illegal data'
            }
          });
        }
      } else {
        res.send({
          status: false,
          info: {
            errType: 'similar data',
            salesReps: similarSalesRepName
          }
        });
      }
    } else if (message.operation === 'submit') {
      let domainName = req.connection.user;
      let adminRight = await AdministratorController.checkAdminRight(domainName);
      let newMainData = message.mainData;
      if (!adminRight || newMainData.RecordOwner === undefined) {
        newMainData.RecordOwner = domainName;
      }
      newMainData.CheckedUsers = generateCheckedUsersArray(domainName);
      newMainData.OpportunityCode = await MainDataController.generateOpportunityCode();
      newMainData.UpdateUser = domainName;
      let createRes = await MainDataController.createMainData(newMainData);
      if (createRes !== false) {
        res.send({
          status: true,
          info: createRes
        });
      } else {
        res.send({
          status: false,
          info: 'illegal data'
        });
      }
    }

  })
;

// specific data
router.route('/api/MainData/:ID')
  .get(async (req, res) => {
    let mainDataID = req.params.ID;
    let domainName = req.connection.user;
    let adminRight = await AdministratorController.checkAdminRight(domainName);
    let rawMainData = await MainDataController.getMainDataByID(mainDataID);
    if (rawMainData === null) {
      res.send({
        status: false,
        info: 'fetch mainData ' + mainDataID + ' err'
      });
      return;
    }
    let fetchRight = false;
    if (adminRight) {
      // modify by admin
      fetchRight = true;
    } else {
      let reviewer = await ReviewerController.getReviewerByDomainName(domainName);
      if (reviewer !== null && rawMainData.Reviewer === reviewer.DisplayName) {
        // limit reviewer
        fetchRight = true;
      } else if (rawMainData.RecordOwner === domainName) {
        // limit record owner
        fetchRight = true;
      }
    }
    if (fetchRight) {
      res.send({
        status: true,
        info: rawMainData
      });
      // modify checked users
      rawMainData = rawMainData.dataValues;
      if (!isCheckedUsers(rawMainData.CheckedUsers, domainName)) {
        rawMainData.CheckedUsers = addCheckedUsers(rawMainData.CheckedUsers, domainName);
        let checkedRes = await MainDataController.updateMainData(rawMainData);
        console.log('add checked users res: ' + checkedRes);
      }
    } else {
      res.send({
        status: false,
        info: 'no fetch right'
      });
    }
  })
  .put(async (req, res) => {
    let mainDataID = req.params.ID;
    let updatedMainData = req.body;
    // filter main data ID
    updatedMainData.ID = mainDataID;
    let domainName = req.connection.user;
    let adminRight = await AdministratorController.checkAdminRight(domainName);
    let reviewer = await ReviewerController.getReviewerByDomainName(domainName);
    let rawMainData = await MainDataController.getMainDataByID(mainDataID);
    let modifyRight = false;
    if (adminRight) {
      // modify by admin
      modifyRight = true;
    } else {
      if (reviewer !== null && rawMainData.Reviewer === reviewer.DisplayName) {
        // limit reviewer
        modifyRight = true;
        updatedMainData.Reviewer = reviewer.DisplayName;
      } else if (rawMainData.RecordOwner === domainName) {
        // limit record owner
        modifyRight = true;
        updatedMainData.RecordOwner = domainName;
      }
    }
    if (modifyRight) {
      // checked users
      updatedMainData.CheckedUsers = generateCheckedUsersArray(domainName);
      updatedMainData.UpdateUser = domainName;
      let updateRes = await MainDataController.updateMainData(updatedMainData);
      if (updateRes) {
        res.send({
          status: true,
          info: 'update mainData success'
        });
      } else {
        res.send({
          status: false,
          info: 'update mainData err'
        });
      }
    } else {
      res.send({
        status: false,
        info: 'no modify right'
      });
    }
  })
  .delete(async (req, res) => {
    let domainName = req.connection.user;
    let mainDataID = req.params.ID;
    let deleteRight = await checkDeleteRight(domainName, mainDataID);
    if (deleteRight) {
      let deleteRes = await MainDataController.deleteMainData(mainDataID);
      if (deleteRes) {
        res.send({
          status: true,
          info: 'delete mainData success'
        });
      } else {
        res.send({
          status: false,
          info: 'delete mainData err'
        });
      }
    } else {
      res.send({
        status: false,
        info: 'no right'
      });
    }
  })
;

// router.route('/api/MainData/Reviewer/transfer')
//   .put(async (req, res) => {
//     let domainName = req.connection.user;
//     let adminRight = await AdministratorController.checkAdminRight(domainName);
//     if (adminRight) {
//       let fromReviewerName = req.body.Reviewer.from;
//       let toReviewerName = req.body.Reviewer.to;
//       let transferRes = await MainDataController.transferReviewer(fromReviewerName, toReviewerName);
//       res.send({
//         status: true,
//         info: transferRes
//       });
//     } else {
//       res.send({
//         status: false,
//         info: 'no fetch right'
//       });
//     }
//   })


let MainDataRouter = function (app) {
  app.use(router)
}

module.exports = MainDataRouter;