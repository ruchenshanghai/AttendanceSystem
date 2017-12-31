const express = require('express');
const app = express();
const router = express.Router();
const server = require('http').createServer(app);

const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');

let config = require('./config');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'database2017',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 3
  }
}));
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

require('./router/index')(router);
app.use('/', router);
app.get('*', function (req, res) {
  console.log('get all the rest url');
  res.sendFile(path.join(__dirname + '/public', 'index.html'));
});

// let moment = require('moment');
// // console.log(moment('2017-12-1').format('YYYY-MM-DD HH:mm:ss'));
// let temp = new Date('ss');
// console.log(temp.toString());
// console.log(Date.parse('ss 12'));
// let password = md5('张星宇3号');
// console.log(password);


server.listen(config.server_port, function () {
  console.log('Express server listening on port %d in %s mode', config.server_port, app.get('env'));
  let test = require('./controller/api/leave');
  test.updateLeave(2, 1, 'type', 'reason', '2016-12-12', '2018-01-13', false, null, null);
});