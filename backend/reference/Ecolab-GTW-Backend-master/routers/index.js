let express = require('express');
let router = express.Router();
let path = require('path');

let travel = require('../utils/travel');
let utilRouter = require('./util');


// router.method('/api', apiRouter);

let IndexRouter = function (app) {
  app.use(router);
  utilRouter(app);
  // load child router
  travel(path.join(__dirname, 'api'), path => {
    require(path)(app);
  });
}

module.exports = IndexRouter;