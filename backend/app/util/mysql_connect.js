let config = require('../config');
let mysql = require('mysql');

let create_connection = function () {
  let connection = mysql.createConnection(config.db_config);
  return connection;
}

module.exports = create_connection;