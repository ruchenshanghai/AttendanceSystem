let config = require('../config');
let InitialConnect = require('../utils/database/initial-connect');
let AdministratorModel = require('../utils/database/models/Administrator');


let AdministratorController = {}

AdministratorController.checkAdminRight = function (domainName) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = AdministratorModel(tempConnect);
    tempModel.findOne({
      where: {
        DomainName: domainName
      }
    }).then(result => {
      console.log('db find admin ' + JSON.stringify(result));
      if (result === null) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
AdministratorController.getDisplayNameByDomainName = function (domainName) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = AdministratorModel(tempConnect);
    tempModel.findOne({
      where: {
        DomainName: domainName
      }
    }).then(result => {
      console.log('db find admin ' + JSON.stringify(result));
      if (result === null) {
        resolve(null);
      } else {
        resolve(result.DisplayName);
      }
    });
  });
}


module.exports = AdministratorController;