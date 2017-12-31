let fs = require('fs');
let path = require('path');

let travel = function (dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    let pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}
module.exports = travel;