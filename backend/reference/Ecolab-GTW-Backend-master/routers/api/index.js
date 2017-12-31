let express = require('express');
let router = express.Router();

router.get('/api', function (req, res) {
  res.send('api');
});
let apiRouter = function (app) {
  app.use(router)
}
module.exports = apiRouter;