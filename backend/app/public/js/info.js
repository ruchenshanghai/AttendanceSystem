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
  $.post(backendhost + "/api/employee/OUT");
    localStorage.clear();
    window.location.href = "../html/info.html";
};

function getStringByDate(date) {
  let d = new Date(date);
  let year = d.getFullYear()
  let month = d.getMonth() + 1;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  let day = d.getDate();
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
}

function addList(list, imgsrc, title, description, func) {
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

function addInput(list, prompt, type, value) {
    let li = document.createElement("li");
    li.innerHTML = prompt;
    let input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("value", value);
    li.appendChild(input);
    list.appendChild(li);
    return input;
}

function addButtons(list, button_types) {
  let li = document.createElement("li");
  let buttons = [];
  for (let i = 0; i < button_types.length; i++) {
    let button = document.createElement("button");
    button.innerHTML = button_types[i];
    li.appendChild(button);
    buttons.push(button);
  }
  list.appendChild(li);
  return buttons;
}

function addSelects(list, prompt_list, select_list) {
    let li = document.createElement("li");
  let selects = [];
  for (let i = 0; i < select_list.length; i++) {
    li.innerHTML = prompt_list[i];
    let select = document.createElement("select");
    for (let j = 0; j < select_list[i].length; j++) {
      let option = document.createElement('option');
      option.innerHTML = select_list[i][j];
      select.appendChild(option);
    }
    li.appendChild(select);
    selects.push(select);
  }
    list.appendChild(li);
  return selects;
}

function addTable(list, tuples, editable, type) {

  let attributes = ['id', 'employee_id', 'check_date', 'check_in_time', 'check_out_time', 'check_in_status', 'check_out_status'];
  let attribute_names = ['考勤号', '员工号', '考勤日期', '签到时间', '签退时间', '签到状态', '签退状态'];
  let attribute_types = ['number', 'number', 'date', 'time', 'time', 'number', 'number'];


  let li = document.createElement('li');
  let table = document.createElement('table');
  let tr = document.createElement('tr');
  for (let i = 0; i < attribute_names.length; i++) {
    let th = document.createElement('th');
    th.innerHTML = attribute_names[i];
    tr.appendChild(th);
  }
  table.appendChild(tr);
  for (let row of tuples) {

    if (!editable) {
      tr = document.createElement('tr');
      for (let i = 0; i < attributes.length; i++) {
        let td = document.createElement('td');
        if (attribute_types[i] == 'date') {
          td.innerHTML = getStringByDate(row[attributes[i]]);
        } else {
          td.innerHTML = row[attributes[i]];
        }

        tr.appendChild(td);
      }
    } else {
      tr = document.createElement('tr');
      for (let i = 0; i < attributes.length; i++) {
        let td = document.createElement('td');
        let new_input = document.createElement('input');
        if (attribute_types[i] == 'date') {
          new_input.setAttribute('value', getStringByDate(row[attributes[i]]));
        } else {
          new_input.setAttribute('value', row[attributes[i]]);
        }
        td.appendChild(new_input);
        tr.appendChild(td);
      }

      let td = document.createElement('td');
      let modifyButton = document.createElement('button');
      modifyButton.innerHTML = '编辑';
      td.appendChild(modifyButton);
      tr.appendChild(td);

      td = document.createElement('td');
      let deleteButton = document.createElement('button');
      deleteButton.innerHTML = '删除';
      td.appendChild(deleteButton);
      tr.appendChild(td);

      let datatds = tr.children;

      modifyButton.onclick = function () {

        for (let i = 0; i < attribute_types.length; i++) {
          let new_input = document.createElement('input');
          new_input.setAttribute('type', attribute_types[i]);
          datatds[i].innerHTML = '';
          datatds[i].appendChild(new_input);
        }


      };
    }

    table.appendChild(tr);
  }
  li.appendChild(table);
  list.appendChild(li);
}

function addLeaveInfo(list, tuples, type) {

  let attributes = ['id', 'employee_id', 'leave_type', 'leave_reason', 'begin_date', 'end_date',
    'submit_status', 'approve_reason', 'approve_status'];
  let attribute_types = ['number', 'number', 'text', 'text', 'date', 'date', 'status', 'text', 'status'];
  let attribute_names = ['考勤号', '员工号', '请假类型', '请假理由', '开始时间', '结束时间',
    '提交状态', '批准理由', '批准状态'];


  for (let i = 0; i < tuples.length; i++) {
    let row = tuples[i];
    let li = document.createElement('li');
    for (let i = 0; i < attributes.length; i++) {
      if (attribute_types[i] == 'date') {
        li.innerHTML += attribute_names[i] + ': ' + getStringByDate(row[attributes[i]]) + '<br />';
      }
      else if (attribute_types[i] == 'status' && row[attributes[i]] == null) {
        li.innerHTML += attribute_names[i] + ': ' + '<br />';
      }
      else {
        li.innerHTML += attribute_names[i] + ': ' + row[attributes[i]] + '<br />';
      }
    }


    switch (type) {
      case 'manager_process': {
        let text = document.createElement("textarea");
        li.appendChild(text);
        let button1 = document.createElement("button");
        button1.innerHTML = '同意';
        button1.onclick = function () {
          if (text.value == '') {
            alert("请填写同意理由");
          } else {
            row['approve_status'] = true;
            row['approve_reason'] = text.value;
            $.ajax({
              url: backendhost + '/api/leave/approve/' + row['id'],
              type: 'PUT',
              data: row,
              success: function (response) {
                console.log(response);
              }
            });
          }
        };
        let button2 = document.createElement('button');
        button2.innerHTML = '拒绝';
        button2.onclick = function () {
          if (text.value == '') {
            alert("请填写拒绝理由");
          } else {
            row['approve_status'] = false;
            row['approve_reason'] = text.value;
            $.ajax({
              url: backendhost + '/api/leave/approve/' + row['id'],
              type: 'PUT',
              data: row,
              success: function (response) {
                console.log(response);
              }
            });
          }
        };
        li.appendChild(button1);
        li.appendChild(button2);
        break;
      }
      case 'manager_approve':
        break;
      case 'manager_reject': {
        let text = document.createElement("textarea");
        li.appendChild(text);
        let button1 = document.createElement("button");
        button1.innerHTML = '同意';
        button1.onclick = function () {
          if (text.value == '') {
            alert("请填写同意理由");
          } else {
            row['approve_status'] = true;
            row['approve_reason'] = text.value;
            $.ajax({
              url: backendhost + '/api/leave/approve/' + row['id'],
              type: 'PUT',
              data: row,
              success: function (response) {
                console.log(response);
              }
            });
          }
        };
        let button2 = document.createElement('button');
        button2.innerHTML = '拒绝';
        button2.onclick = function () {
          if (text.value == '') {
            alert("请填写拒绝理由");
          } else {
            row['approve_status'] = false;
            row['approve_reason'] = text.value;
            $.ajax({
              url: backendhost + '/api/leave/approve/' + row['id'],
              type: 'PUT',
              data: row,
              success: function (response) {
                console.log(response);
              }
            });
          }
        };
        li.appendChild(button1);
        li.appendChild(button2);
        break;
      }
      case 'asker_save': {
        let button1 = document.createElement("button");
        button1.innerHTML = '申请';
        button1.onclick = function () {
          $.post(backendhost + "/api/leave", row, function (data) {
            if (data) {
              console.log(data);
            }
            else {
              alert("失败了");
            }

          });
        };
        let button2 = document.createElement('button');
        button2.innerHTML = '取消';
        button2.onclick = function () {
          $.ajax({
            url: backendhost + '/api/leave/' + row['id'],
            type: 'DELETE',
            success: function (response) {
              console.log(response);
              li.outerHTML = '';
              tuples.splice(i, 1);
            }
          });
        };
        li.appendChild(button1);
        li.appendChild(button2);
        break;
      }
      case 'asker_process': {
        let button2 = document.createElement('button');
        button2.innerHTML = '撤回';
        button2.onclick = function () {
          $.ajax({
            url: backendhost + '/api/leave/' + row['id'],
            type: 'DELETE',
            success: function (response) {
              console.log(response);
              li.outerHTML = '';
              tuples.splice(i, 1);
            }
          });

        };
        li.appendChild(button2);
        break;
      }
      case 'asker_approve':
        let button2 = document.createElement('button');
        button2.innerHTML = '删除记录';
        button2.onclick = function () {
          $.ajax({
            url: backendhost + '/api/leave/' + row['id'],
            type: 'DELETE',
            success: function (response) {
              console.log(response);
              li.outerHTML = '';
              tuples.splice(i, 1);
            }
          });

        };
        li.appendChild(button2);
        break;
      case 'asker_reject': {
        let button1 = document.createElement("button");
        button1.innerHTML = '重新申请';
        button1.onclick = function () {
          $.post(backendhost + "/api/leave", row, function (data) {
            if (data) {
              console.log(data);
            }
            else {
              alert("失败了");
            }

          });
        };
        let button2 = document.createElement('button');
        button2.innerHTML = '取消';
        button2.onclick = function () {
          $.ajax({
            url: backendhost + '/api/leave/' + row['id'],
            type: 'DELETE',
            success: function (response) {
              console.log(response);
              li.outerHTML = '';
              tuples.splice(i, 1);

            }
          });
        };
        li.appendChild(button1);
        li.appendChild(button2);
        break;
      }
    }
    list.appendChild(li);
  }
}

function getTuplesByValue(tuples, attribute, value) {
  let newTuples = [];
  for (let i = 0; i < tuples.length; i++) {
    if (tuples[attribute] == value) {
      newTuples.push(tuples[i]);
    }
  }
  return newTuples;
}

function getTuplesByValueInterval(tuples, attribute1, attribute2, value1, value2) {
  let newTuples = [];
  for (let i = 0; i < tuples.length; i++) {
    if (tuples[attribute1] >= value1 && tuples[attribute2] <= value2) {
      newTuples.push(tuples[i]);
    }
  }
  return newTuples;
}

function getTuplesByIntervalValues(tuples, attribute1, attribute2, value) {
  let newTuples = [];
  for (let i = 0; i < tuples.length; i++) {
    if (tuples[attribute1] <= value && tuples[attribute2] >= value) {
      newTuples.push(tuples[i]);
    }
  }
  return newTuples;
}


let checkManage = document.getElementById("checkManage");
checkManage.onclick = function () {
    listHeading.innerHTML = "考勤管理";
    list.innerHTML = '';
  addList(list, "", "签到", "", function () {
        //todo
    $.post(backendhost + "/api/check/IN", function (data) {
      console.log(data);
      let checkInRes = data['checkInRes'];
      if (checkInRes == 'time error') {
        alert("您今天翘班了");
      }
      else if (checkInRes['code'] == "ER_DUP_ENTRY") {
        alert("您今天已经签过到了");
      }
      else {
        console.log(data);
        alert("签到成功");
      }
    });
    });
  addList(list, "", "签退", "", function () {
        //todo
    $.post(backendhost + "/api/check/OUT", function (data) {
      let checkOutRes = data['checkOutRes'];
      if (checkOutRes == 'time error') {
        alert("现在不是签退时间");
      }
      else if (checkOutRes['code'] == "ER_DUP_ENTRY") {
        alert("您今天已经签过退了");
      }
      else {
        alert("签退成功");
      }
    });
    });

};

let leaveManage = document.getElementById("leaveManage");
leaveManage.onclick = function () {
    listHeading.innerHTML = "请假管理";
    list.innerHTML = '';
  addList(list, "", "申请请假", "", function () {
        //todo
    let button_types = ['submit', 'reset'];
    let leave_types = ['SELF_LEAVE', 'SICK_LEAVE', 'MATERNITY_LEAVE', 'WEDDING_LEAVE'];
        listHeading.innerHTML = "申请请假";
        list.innerHTML = '';
    let startDateInput = addInput(list, "开始日期", "date", '2018-01-13');
    let endDateInput = addInput(list, "结束日期", "date", getStringByDate(new Date()));
    let selects = addSelects(list, ["请假类型"], [leave_types]);
    let reason = addInput(list, "请假理由", "text", "");
    let buttons = addButtons(list, button_types);

    buttons[0].onclick = function () {
      console.log(selects[0].value);
      console.log(userInfo['id']);
      console.log(reason.value);
      $.post(backendhost + "/api/leave", {
        employee_id: userInfo['id'],
        leave_type: selects[0].value,
        leave_reason: reason.value,
        begin_date: startDateInput.value,
        end_date: endDateInput.value,
        submit_status: true,
        approve_reason: " ",
      }, function (data) {
        if (data) {
          console.log(data);
        }
        else {
          alert("No such id");
        }

      });
    };
    buttons[1].onclick = function () {
      startDateInput.value = new Date();
      endDateInput.value = new Date();
    };

    });
    if (userInfo['headRight'] || userInfo['personnelRight']) {
      addList(list, "", "审核请假", "", function () {
            //todo
        });
    }
};

let tripManage = document.getElementById("tripManage");
tripManage.onclick = function () {
    listHeading.innerHTML = "出差管理";
    list.innerHTML = '';
  addList(list, "", "申请出差", "", function () {
        //todo
    });
    if (userInfo['headRight'] || userInfo['personnelRight']) {
      addList(list, "", "审核出差", "", function () {
            //todo
        });
    }
};

let humanManage = document.getElementById("humanManage");
humanManage.onclick = function () {
    listHeading.innerHTML = "人事管理";
    list.innerHTML = '';
    if (userInfo['adminRight']) {
      addList(list, "", "新增员工信息", "", function () {
            //todo
        });
      addList(list, "", "修改员工信息", "", function () {
            //todo
        });
      addList(list, "", "查询员工信息", "", function () {
            //todo
        });
      addList(list, "", "新增部门信息", "", function () {
            //todo
        });
      addList(list, "", "修改部门信息", "", function () {
            //todo
        });
      addList(list, "", "查询部门信息", "", function () {
            //todo
        });
    }
};

let logManage = document.getElementById("logManage");
logManage.onclick = function () {
    listHeading.innerHTML = "日志管理";
    if (userInfo['adminRight']) {
        list.innerHTML = '';
      addList(list, "", "日志记录", "", function () {
            //todo

        });
    }
};

let checkQuery = document.getElementById("checkQuery");
checkQuery.onclick = function () {
    listHeading.innerHTML = "考勤查询";
    list.innerHTML = '';
  addList(list, "", "个人考勤信息查询", "", function () {
        //todo
    listHeading.innerHTML = "个人考勤信息查询";
    list.innerHTML = '';

    $.get(backendhost + "/api/check", function (data) {
      console.log(data);
      let tuples = data['getRes']['employeeChecks'];
      let personal_tuples = [];
      for (let row of tuples) {
        if (row['id'] == userInfo['id']) {
          personal_tuples.push(row);
        }
      }
      addTable(list, tuples, editable = false, type = 'check');

    });
    });
  addList(list, "", "部门考勤信息查询", "", function () {
        //todo
    });
  addList(list, "", "全体员工考勤信息查询", "", function () {
        //todo
    listHeading.innerHTML = "全体员工考勤信息";
    list.innerHTML = '';

    $.get(backendhost + "/api/check", function (data) {
      let tuples = data['getRes']['employeeChecks'];
      console.log(data);
      addTable(list, tuples, editable = true, type = 'check');
    });
    });
};

let leaveQuery = document.getElementById("leaveQuery");
leaveQuery.onclick = function () {
    listHeading.innerHTML = "请假查询";
    list.innerHTML = '';
  addList(list, "", "个人请假信息查询", "", function () {
    //todo
    listHeading.innerHTML = "个人请假信息" + "<br>";

    list.innerHTML = '';

    let attributes = ['all', 'date', 'date_interval', 'department', 'id', 'name'];

    //创建一个筛选select
    listHeading.innerHTML += "筛选条件";
    let select = document.createElement("select");
    for (let j = 0; j < attributes.length; j++) {
      let option = document.createElement('option');
      option.innerHTML = attributes[i];
      select.appendChild(option);
    }
    listHeading.appendChild(select);
    listHeading.innerHTML += '<br>';

    let textInput = document.createElement("input");
    textInput.setAttribute('type', 'text');
    let numberInput = document.createElement("input");
    numberInput.setAttribute('type', 'number');
    let dateInput1 = document.createElement("input");
    dateInput1.setAttribute('type', 'date');
    let dateInput2 = document.createElement("input");
    dateInput2.setAttribute('type', 'date');

    let inputDiv = document.createElement("div");
    listHeading.appendChild(inputDiv);

    select.onchange = function () {
      inputDiv.innerHTML = '';
      switch (select.value) {
        case 'all':
          break;
        case 'date':
          inputDiv.appendChild(dateInput1);
          break;
        case 'date_interval':
          inputDiv.appendChild(dateInput1);
          inputDiv.appendChild(dateInput2);
          break;
        case 'department':
          inputDiv.appendChild(textInput);
          break;
        case 'id':
          inputDiv.appendChild(numberInput);
          break;
        case 'name':
          inputDiv.appendChild(numberInput);
          break;
      }
    };

    let filterButton = document.createElement("button");
    filterButton.innerHTML = 'filter';
    listHeading.appendChild(filterButton);


    let buttons = [];
    let button_prompts = ['待处理', '接受', '拒绝', '未提交'];
    for (let i = 0; i < button_prompts.length; i++) {
      let button = document.createElement("button");
      button.innerHTML = button_prompts[i];
      listHeading.appendChild(button);
      buttons.push(button);
    }


    $.get(backendhost + "/api/leave", function (data) {
      let tuples = data['getRes']['employeeLeaves'];
      let personal_tuples = getTuplesByValue(tuples, 'employee_id', userInfo['id']);
      let display_tuples = personal_tuples;
      add_personal_tuples(display_tuples);
      filterButton.onclick = function () {
        switch (select.value) {
          case 'all':
            display_tuples = personal_tuples;
          case 'date':
            display_tuples = getTuplesByIntervalValues(personal_tuples, 'begin_date', 'end_date', dateInput1.value);
            break;
          case 'date_interval':
            display_tuples = getTuplesByValueInterval(personal_tuples, 'begin_date', 'end_date', dateInput1.value);
            break;
          case 'department':
            inputDiv.appendChild(textInput);
            break;
          case 'id':
            inputDiv.appendChild(numberInput);
            break;
          case 'name':
            inputDiv.appendChild(numberInput);
            break;
        }
        add_personal_tuples(display_tuples);
      };


      function add_personal_tuples(personal_tuples) {
        let asker_tuples = [];
        for (let i = 0; i < buttons.length; i++) {
          asker_tuples[i] = [];
        }
        for (let row of personal_tuples) {
          if (row['submit_status'] == true && row['approve_status'] == null) {
            asker_tuples[0].push(row);
          }
          else if (row['submit_status'] == true && row['approve_status'] == true) {
            asker_tuples[1].push(row);
          }
          else if (row['submit_status'] == true && row['approve_status'] == false) {
            asker_tuples[2].push(row);
          }
          else if (row['submit_status'] == false) {
            asker_tuples[3].push(row);
          }
        }
        let button_states = ['asker_process', 'asker_approve', 'asker_reject', 'asker_save'];
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].onclick = function () {
            list.innerHTML = '';
            addLeaveInfo(list, asker_tuples[i], button_states[i]);
          }
        }
      }


    });

  });
  addList(list, "", "部门请假信息查询", "", function () {
        //todo
    });
  addList(list, "", "全体员工请假信息查询", "", function () {
        //todo
    listHeading.innerHTML = "全体员工请假信息";

    list.innerHTML = '';
    let buttons = [];
    let button_prompts = ['待处理', '已接受', '已拒绝'];
    for (let i = 0; i < button_prompts.length; i++) {
      let button = document.createElement("button");
      button.innerHTML = button_prompts[i];
      listHeading.appendChild(button);
      buttons.push(button);
    }


    $.get(backendhost + "/api/leave", function (data) {
      let tuples = data['getRes']['employeeLeaves'];
      let manager_tuples = [];
      for (let i = 0; i < buttons.length; i++) {
        manager_tuples[i] = [];
      }
      for (let row of tuples) {
        if (row['submit_status'] == true && row['approve_status'] == null) {
          manager_tuples[0].push(row);
        }
        else if (row['submit_status'] == true && row['approve_status'] == true) {
          manager_tuples[1].push(row);
        }
        else if (row['submit_status'] == true && row['approve_status'] == false) {
          manager_tuples[2].push(row);
        }
        else if (row['submit_status'] == false) {
          manager_tuples[3].push(row);
        }
      }

      let button_states = ['manager_process', 'manager_approve', 'manager_reject'];
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
          list.innerHTML = '';
          addLeaveInfo(list, manager_tuples[i], button_states[i]);
        }
      }
    });


    });
};

let tripQuery = document.getElementById("tripQuery");
tripQuery.onclick = function () {
    listHeading.innerHTML = "出差查询";
    list.innerHTML = '';
  addList(list, "", "个人出差信息查询", "", function () {
        //todo
    });
  addList(list, "", "部门出差信息查询", "", function () {
        //todo
    });
  addList(list, "", "全体员工出差信息查询", "", function () {
    //todo
  });
};

let singleSetting = document.getElementById("singleSetting");
singleSetting.onclick = function () {
  listHeading.innerHTML = "个人设置";
  list.innerHTML = '';
  addList(list, "", "修改密码", "", function () {
        //todo
    let oldP = addInput(list, '旧密码', 'password', '');
    let newP = addInput(list, '新密码', 'password', '');
    let reP = addInput(list, '新密码确认', 'password', '');
    let buttons = addButtons(list, ['Submit', 'Reset']);
    buttons[0].onclick = function () {
      //todo 修改密码
    };
    buttons[1].onclick = function () {
      oldP.value = '';
      newP.value = '';
      reP.value = '';
    };
    });
};

let setting = document.getElementById("setting");
setting.onclick = function () {
    listHeading.innerHTML = "系统设置";
    list.innerHTML = '';
    if (userInfo['adminRight']) {
      addList(list, "", "上下班时间设定", "", function () {
            //todo
        $.get(backendhost + "/api/setting", function (data) {
                let timeArray = data['getRes'];
          listHeading.innerHTML = "上下班时间设定";
                list.innerHTML = '';
          startDateInput = addInput(list, "开始时间", "time", timeArray[0]['value']);
          endDateInput = addInput(list, "结束时间", "time", timeArray[1]['value']);
          buttons = addButtons(list, ['submit', 'reset']);
          console.log(buttons);
                buttons[0].onclick = function () {
                    $.ajax({
                      url: backendhost + '/api/setting/1',
                        type: 'PUT',
                      data: {id: 1, name: 'CHECK_IN_TIME', value: startDateInput.value},
                      success: function (response) {
                            console.log(response);
                        }
                    });
                    $.ajax({
                      url: backendhost + '/api/setting/2',
                        type: 'PUT',
                      data: {id: 2, name: 'CHECK_OUT_TIME', value: endDateInput.value},
                      success: function (response) {
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
      addList(list, "", "上班放假时间设定", "", function () {
            //todo
        });
      addList(list, "", "员工权限设定", "", function () {
            //todo
        });
    }
};