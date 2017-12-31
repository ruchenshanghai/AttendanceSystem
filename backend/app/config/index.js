let dev_config = require('./dev');
let prd_config = require('./prd');
let test_config = require('./test');


module.exports = {
  development: dev_config,
  production: prd_config,
  test: test_config
}[process.env.NODE_ENV || 'development']