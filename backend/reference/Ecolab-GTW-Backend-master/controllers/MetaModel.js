const config = require('../config');
const path = require('path');
const InitialConnect = require('../utils/database/initial-connect');
const modelPath = '../utils/database/models/MetaModel';

const metaNameArray = ['AssistCAM', 'BUDistrict', 'CompetitorCN', 'ContractTerm', 'CTCBU', 'FollowingStatus', 'MarketClassification', 'PipelineStatus', 'SalesType', 'TargetRate', 'Administrator', 'Currency', 'Reviewer'];

let MetaModelController = {}


MetaModelController.isLegalMetaModelName = function (modelName) {
  let index;
  for (index = 0; index < metaNameArray.length; index++) {
    if (metaNameArray[index] === modelName) {
      return true;
    }
  }
  return false;
}

MetaModelController.getMetaDataByModelName = async function (modelName, targetDataContainer) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModelModule = require(path.join(modelPath, modelName));
    let tempModel = tempModelModule(tempConnect);
    tempModel.findAll().then(result => {
      console.log('get meta model: ' + modelName + ' result: ' + JSON.stringify(result));
      targetDataContainer[modelName] = result;
      resolve(result);
    }).catch(err => {
      console.log('get meta model: ' + modelName + ' err: ' + JSON.stringify(err));
      resolve(null);
    });
  });
}

MetaModelController.getMetaDataByModelNameAndID = async function (modelName, dataID) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModelModule = require(path.join(modelPath, modelName));
    let tempModel = tempModelModule(tempConnect);
    tempModel.findById(dataID).then(result => {
      console.log('get meta model: ' + modelName + ' ID; ' + dataID + ' result: ' + JSON.stringify(result));
      resolve(result);
    }).catch(err => {
      console.log('get meta model: ' + modelName + ' err: ' + JSON.stringify(err));
      resolve(null);
    });
  });
}

//
MetaModelController.getAllMetaData = async function () {
  return new Promise((resolve, reject) => {
    let resultContainer = {};
    let promiseArray = [];
    let index;
    for (index = 0; index < metaNameArray.length; index++) {
      promiseArray.push(this.getMetaDataByModelName(metaNameArray[index], resultContainer));
    }
    Promise.all(promiseArray).then(multiRes => {
      console.log('get all meta model data' + multiRes);
      resolve(resultContainer);
    });
  });
}
//
MetaModelController.createMetaData = function (modelName, newMetaData) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModelModule = require(path.join(modelPath, modelName));
    let tempModel = tempModelModule(tempConnect);
    tempModel.create(newMetaData).then(res => {
      console.log('db success create ' + modelName + ' res: ' + JSON.stringify(res));
      resolve(true);
    }).catch(err => {
      console.log('db create ' + modelName + ' err: ' + JSON.stringify(err));
      resolve(false);
    });
  });
}
//
MetaModelController.updateMetaModelByID = function (modelName, updatedMetaData) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModelModule = require(path.join(modelPath, modelName));
    let tempModel = tempModelModule(tempConnect);
    tempModel.update(updatedMetaData,
      {
        where: {
          ID: updatedMetaData.ID
        }
      }).then(count => {
      console.log('db update ' + modelName + ' count: ' + count.length);
      if (count.length === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch(err => {
      console.log('db update ' + modelName + ' err: ' + JSON.stringify(err));
      resolve(false);
    })
  });
}
//
MetaModelController.deleteMetaModelByID = function (modelName, deletedMetaDataID) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModelModule = require(path.join(modelPath, modelName));
    let tempModel = tempModelModule(tempConnect);
    tempModel.destroy(
      {
        where: {
          ID: deletedMetaDataID,
        }
      }).then(count => {
      console.log('db delete ' + modelName + ' count: ' + count);
      if (count === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch(err => {
      console.log('db delete ' + modelName + ' err: ' + JSON.stringify(err));
      resolve(false);
    })
  });
}

module.exports = MetaModelController;