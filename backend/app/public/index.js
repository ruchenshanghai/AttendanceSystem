$(document).ready(function () {
  $.post('/api/employee', {
    id: 6,
    password: '4f619a0187425061409d1b70577aa6ad'
  }, function (res, status) {
    console.log(JSON.stringify(status));
    console.log(JSON.stringify(res));
  });
});