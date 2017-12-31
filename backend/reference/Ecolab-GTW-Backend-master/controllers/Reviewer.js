const config = require('../config');
const InitialConnect = require('../utils/database/initial-connect');
const ReviewerModel = require('../utils/database/models/Reviewer');


let ReviewerController = {}
//
ReviewerController.getReviewerByDomainName = function (domainName) {
  return new Promise((resolve, reject) => {
    let tempConnect = InitialConnect(config);
    let tempModel = ReviewerModel(tempConnect);
    tempModel.findOne({
      where: {
        DomainName: domainName
      }
    }).then(result => {
      console.log('db find reviewer ' + JSON.stringify(result));
      resolve(result);
    }).catch(err => {
      console.log('db find reviewer err: ' + JSON.stringify(err));
      resolve(null);
    });
  });
}

module.exports = ReviewerController;