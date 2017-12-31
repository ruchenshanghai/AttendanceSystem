var default_env = require('./default');
var development_env = require('./development');
var production_env = require('./production');
var test_env = require('./test');

module.exports = {
  default: default_env,
  development: development_env,
  production: production_env,
  test: test_env
}[process.env.NODE_ENV || 'default']