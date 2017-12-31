const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');
const cors = require('express-cors');

let config = require('./config/production');

// // !!! cautious
// const Sync = require('./utils/database/sync-model-to-database')(path.join(__dirname, 'utils/database/models'));


const app = express();
let server = require('http').createServer(app);

app.use(logger('dev'));
app.use(function (req, res, next) {
  var nodeSSPI = require('node-sspi');
  var nodeSSPIObj = new nodeSSPI({
    retrieveGroups: true
  });
  nodeSSPIObj.authenticate(req, res, function (err) {
    res.finished || next();
  });
});
app.use(bodyParser.json());

let router = require('./routers/index');
router(app);

app.use(express.static(__dirname + '/public'));
app.get('*', function (req, res) {
  console.log('get / index');
  res.sendFile(path.join(__dirname + '/public', 'index.html'));
});


// let test = require('./controllers/MainData');
// test.getMainDataByID(120).then(result => {
//   let temp = Object.keys(result.dataValues);
//   console.log(temp);
// });

server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});