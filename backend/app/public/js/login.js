/**
 * Created by XY Zhang on 2018/1/10.
 */
let backendhost = "";

let userInfo = JSON.parse(localStorage.getItem('userInfo'));
if (userInfo) {
    window.location.href = "../html/index.html";
}

let login_submit = document.getElementById("logInSubmit");
login_submit.onclick = function() {
    let id = $("#id").val();
    let password = $("#password").val();
    if (!id) {
        alert("Input your id");
        return;
    }
    if (!password) {
        alert("Input your password");
        return;
    }
    $.post(backendhost+"/api/employee", {id: id, password: md5(password)}, function (data) {
        if (data) {
            if (data['loginRes'] == "password error") {
                alert("password error");
            }
            else {
                localStorage.setItem("userInfo", JSON.stringify(data['loginRes']));
                /*
                localStorage.setItem("name", data['name']);
                if (!!data['adminRight'] == true) {
                    localStorage.setItem("right","admin");
                }
                else if (!!data['personnelRight'] == true) {
                    localStorage.setItem("right","personnel");
                }
                else if (!!data['headRight'] == true) {
                    localStorage.setItem("right","head");
                }
                else if (!!data[''])
                localStorage.setItem("right", "");
                */
                window.location.href = "../html/info.html";
            }
        }
        else {
            alert("No such id");
        }

    });


};