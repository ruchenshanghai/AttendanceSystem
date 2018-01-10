/**
 * Created by XY Zhang on 2018/1/10.
 */
let userInfo = JSON.parse(localStorage.getItem('userInfo'));
if (userInfo) {
    window.location.href = "../html/info.html";
} else {
    window.location.href = "../html/login.html";
}