/**
 * Created by XY Zhang on 2018/1/10.
 */
let backendhost = "";

let userInfo = JSON.parse(localStorage.getItem('userInfo'));
if (!userInfo) {
    window.location.href = "../html/index.html";
}

console.log(userInfo);
let filter = document.getElementById("filter");
let listHeading = document.getElementById("listHeading");
let list = document.getElementById("listContent");
let logout = document.getElementById("logout");
logout.onclick = function () {
    $.post(backendhost+"/api/employee/OUT");
    localStorage.clear();
    window.location.href = "../html/info.html";
};

function addList(imgsrc, title, description, func) {
    let li = document.createElement("li");
    let img = document.createElement("img");
    img.setAttribute("src", imgsrc);
    img.setAttribute("height", 150);
    img.setAttribute("width", 150);
    let article = document.createElement("article");
    let p1 = document.createElement("p");
    p1.setAttribute("class", "description");
    p1.innerHTML = description;
    article.appendChild(p1);
    let p2 = document.createElement("p");
    p2.setAttribute("class", "buttonSet");
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerHTML = title;
    p2.appendChild(button);
    article.appendChild(p2);
    li.appendChild(article);
    list.appendChild(li);
    button.onclick = func;
}
function addInput(prompt, type, value) {
    let li = document.createElement("li");
    li.innerHTML = prompt;
    let input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("value", value);
    li.appendChild(input);
    list.appendChild(li);
    return input;
}
function addButtons() {
    let li = document.createElement("li");
    let submitButton = document.createElement("button");
    submitButton.innerHTML = "submit";
    li.appendChild(submitButton);
    let resetButton = document.createElement("button");
    resetButton.innerHTML = "reset";
    li.appendChild(resetButton);
    list.appendChild(li);
    return [submitButton, resetButton];
}

let checkManage = document.getElementById("checkManage");
checkManage.onclick = function() {
    listHeading.innerHTML = "考勤管理";
    list.innerHTML = '';
    addList("", "签到", "", function () {
        //todo
        $.post(backendhost+"/api/check/IN");
    });
    addList("", "签退", "", function () {
        //todo
        $.post(backendhost+"/api/check/OUT");
    });
    addList("", "修改密码", "", function () {
        //todo
        $.post(backendhost+"/api/check/OUT");
    });
};

let leaveManage = document.getElementById("leaveManage");
leaveManage.onclick = function () {
    listHeading.innerHTML = "请假管理";
    list.innerHTML = '';
    addList("", "申请请假", "", function () {
        //todo
        listHeading.innerHTML = "申请请假";
        list.innerHTML = '';
        addInput("date", "开始时间");
        addInput("date", "结束时间");

    });
    if (userInfo['headRight'] || userInfo['personnelRight']) {
        addList("", "审核请假", "", function () {
            //todo
        });
    }
};

let tripManage = document.getElementById("tripManage");
tripManage.onclick = function () {
    listHeading.innerHTML = "出差管理";
    list.innerHTML = '';
    addList("", "申请出差", "", function () {
        //todo
    });
    if (userInfo['headRight'] || userInfo['personnelRight']) {
        addList("", "审核出差", "", function () {
            //todo
        });
    }
};

let humanManage = document.getElementById("humanManage");
humanManage.onclick = function () {
    listHeading.innerHTML = "人事管理";
    list.innerHTML = '';
    if (userInfo['adminRight']) {
        addList("", "新增员工信息", "", function () {
            //todo
        });
        addList("", "修改员工信息", "", function () {
            //todo
        });
        addList("", "查询员工信息", "", function () {
            //todo
        });
        addList("", "新增部门信息", "", function () {
            //todo
        });
        addList("", "修改部门信息", "", function () {
            //todo
        });
        addList("", "查询部门信息", "", function () {
            //todo
        });
    }
};

let logManage = document.getElementById("logManage");
logManage.onclick = function () {
    listHeading.innerHTML = "日志管理";
    if (userInfo['adminRight']) {
        list.innerHTML = '';
        addList("", "日志记录", "", function () {
            //todo

        });
    }
};

let checkQuery = document.getElementById("checkQuery");
checkQuery.onclick = function () {
    listHeading.innerHTML = "考勤查询";
    list.innerHTML = '';
    addList("", "个人考勤信息查询", "", function () {
        //todo
    });
    addList("", "部门考勤信息查询", "", function () {
        //todo
    });
    addList("", "全体员工考勤信息查询", "", function () {
        //todo
    });
};

let leaveQuery = document.getElementById("leaveQuery");
leaveQuery.onclick = function () {
    listHeading.innerHTML = "请假查询";
    list.innerHTML = '';
    addList("", "个人请假信息查询", "", function () {
        //todo
    });
    addList("", "部门请假信息查询", "", function () {
        //todo
    });
    addList("", "全体员工请假信息查询", "", function () {
        //todo
    });
};

let tripQuery = document.getElementById("tripQuery");
tripQuery.onclick = function () {
    listHeading.innerHTML = "出差查询";
    list.innerHTML = '';
    addList("", "个人出差信息查询", "", function () {
        //todo
    });
    addList("", "部门出差信息查询", "", function () {
        //todo
    });
    addList("", "全体员工出差信息查询", "", function () {
        //todo
    });
};

let setting = document.getElementById("setting");
setting.onclick = function () {
    listHeading.innerHTML = "系统设置";
    list.innerHTML = '';
    if (userInfo['adminRight']) {
        addList("", "上下班时间设定", "", function () {
            //todo
            $.get(backendhost+"/api/setting", function (data) {
                let timeArray = data['getRes'];
                listHeading.innerHTML = "申请请假";
                list.innerHTML = '';
                startDateInput = addInput("开始时间", "time", timeArray[0]['value']);
                endDateInput = addInput("结束时间", "time", timeArray[1]['value']);
                buttons = addButtons();
                buttons[0].onclick = function () {
                    $.ajax({
                        url: backendhost+'/api/setting/1',
                        type: 'PUT',
                        data: {id:1, name:'CHECK_IN_TIME', value:startDateInput.value},
                        success: function( response ) {
                            console.log(response);
                        }
                    });
                    $.ajax({
                        url: backendhost+'/api/setting/2',
                        type: 'PUT',
                        data: {id:2, name:'CHECK_OUT_TIME', value:endDateInput.value},
                        success: function( response ) {
                            console.log(response);
                        }
                    });
                };
                buttons[1].onclick = function () {
                    startDateInput.value = timeArray[0]['value'];
                    endDateInput.value = timeArray[1]['value'];
                };
            });
        });
        addList("", "上班放假时间设定", "", function () {
            //todo
        });
        addList("", "员工权限设定", "", function () {
            //todo
        });
    }
};