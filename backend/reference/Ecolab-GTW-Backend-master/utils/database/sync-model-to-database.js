const fs = require('fs');

const config = require('../../config');
const travel = require('../travel');
const InitialConnect = require('./initial-connect');

let SyncModelToDataBase = function (modelPath) {
  let connection = new InitialConnect(config);
  if (fs.existsSync(modelPath)) {
    travel(modelPath, path => {
      // console.log(path);
      require(path)(connection);
    });
  }
  connection.sync({force: true}).then((res) => {
    console.log(res);
    console.log('load over');
  })
}

module.exports = SyncModelToDataBase;