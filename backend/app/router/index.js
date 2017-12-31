let travel = require('../util/travel');
let path = require('path');

let IndexRouter = function (router) {
  router.get('/index', (req, res) => {
    res.json({
      info: 'index'
    });
  });
  travel(path.join(__dirname, 'api'), file_path => {
    require(file_path)(router, file_path);
  });
}
module.exports = IndexRouter;