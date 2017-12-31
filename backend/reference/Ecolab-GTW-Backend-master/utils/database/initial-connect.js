const Sequelize = require('sequelize');

let InitialConnect = function (config) {
  // return new Promise(function (res, rej) {
  let connect = new Sequelize(config.DBconfig.database, config.DBconfig.user, config.DBconfig.password, config.DBconfig.connectConfig);
  return connect;
  // });

}

module.exports = InitialConnect;