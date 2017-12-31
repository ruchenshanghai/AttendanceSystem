let path = require('path');
let router_path = path.join(process.cwd(), 'router');

let parse_router = function (absolute_path) {
  let temp_router_url = path.relative(router_path, absolute_path);
  let temp_length = temp_router_url.length;
  temp_router_url = temp_router_url.substring(0, temp_length - 3);
  temp_router_url = temp_router_url.replace(/\\/g, '\/');
  temp_router_url = '/' + temp_router_url.substring(0, temp_length - 3);
  return temp_router_url;
}

module.exports = parse_router;