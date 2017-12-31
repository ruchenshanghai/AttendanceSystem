let mysql_connect = require('../../util/mysql_connect');

let controller = {};

controller.CHECK_IN_NAME = 'CHECK_IN_TIME';
controller.CHECK_OUT_NAME = 'CHECK_OUT_TIME';
controller.LEAVE_TYPE = {
  SELF_LEAVE: 'SELF_LEAVE',
  SICK_LEAVE: 'SICK_LEAVE',
  MATERNITY_LEAVE: 'MATERNITY_LEAVE',
  WEDDING_LEAVE: 'WEDDING_LEAVE'
}
controller.TRIP_TYPE = {
  COMPANY_ASSIGN: 'COMPANY_ASSIGN',
  PERSONAL_APPLICATION: 'PERSONAL_APPLICATION'
}



// get all settings
controller.getAllSettings = async function () {
  let settingsRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT * FROM setting;';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select all settings: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return settingsRes;
}

// get setting value by name
controller.getValueByName = async function (name) {
  let queryRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let selectSql = 'SELECT value FROM setting WHERE name=\'' + name + '\';';
      connection.query(selectSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('select setting name: ' + name + ', value: ' + JSON.stringify(results));
          if (results.length === 1) {
            resolve(results[0]);
          } else {
            resolve('select error');
          }
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      resolve('select error');
    }
  });
  return queryRes;
}

// update setting name and value
controller.updateSettingByID = async function (updateSetting) {
  let updateRes = await new Promise((resolve, reject) => {
    try {
      let connection = mysql_connect();
      connection.connect();
      console.log('oepn connection');
      let updateSql = 'UPDATE setting SET name=\'' + updateSetting.name + '\', value=\'' + updateSetting.value + '\' WHERE id=' + updateSetting.id + ';';
      connection.query(updateSql, function (err, results, fileds) {
        if (err) {
          console.log(JSON.stringify(err));
          resolve(err);
        } else {
          console.log('update setting: ' + JSON.stringify(results));
          resolve(results);
        }
      });
      console.log('close connection');
      connection.end();
    } catch (err) {
      console.log(JSON.stringify(err));
      resolve('update error');
    }
  });
  return updateRes;
}

module.exports = controller;