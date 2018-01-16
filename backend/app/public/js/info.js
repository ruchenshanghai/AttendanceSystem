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

function getDifferenceMilliseconds(date1, date2) {
  let d1 = new Date(date1);
  let d2 = new Date(date2);
  console.log(d2.getTime() - d1.getTime());
  return d2.getTime() - d1.getTime();
}
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

function addTable(list, tuples, type, editable = true) {
  let attributes;
  let attribute_names;
  let attribute_types;
  switch (type) {
    case 'check':
      attributes = ['id', 'employee_id', 'check_date', 'check_in_time', 'check_out_time', 'check_in_status', 'check_out_status'];
      attribute_names = ['考勤号', '员工号', '考勤日期', '签到时间', '签退时间', '签到状态', '签退状态'];
      attribute_types = ['number', 'number', 'date', 'time', 'time', 'number', 'number'];
      break;
    case 'employee':
      attributes = ['id', 'name', 'right', 'department_id', 'department_name', 'department_code'];
      attribute_names = ['员工号', '姓名', '权限', '部门号', '部门名称', '部门码'];
      attribute_types = ['number', 'text', 'text', 'number', 'text', 'text'];
      break;
    case 'department':
      attributes = ['id', 'name', 'code'];
      attribute_names = ['部门号', '部门名称', '部门码'];
      attribute_types = ['number', 'text', 'text'];
      break;
  }


  let li = document.createElement('li');
  let table = document.createElement('table');
  let tr = document.createElement('tr');
  for (let i = 0; i < attribute_names.length; i++) {
    let th = document.createElement('th');
    th.innerHTML = attribute_names[i];
    tr.appendChild(th);
    let reverse = false;
    th.onclick = function () {
      let new_tuples = getSortedTuplesByAttribute(tuples, attributes[i], reverse);
      reverse = !reverse;
      addTableCells(new_tuples);
    }
  }
  table.appendChild(tr);
  addTableCells(tuples);
  li.appendChild(table);
  list.appendChild(li);

  function addTableCells(tuples) {

    let childs = table.childNodes;
    for (let i = childs.length - 1; i >= 1; i--) {
      table.removeChild(childs[i]);
    }
    for (let i = 0; i < tuples.length; i++) {
      let row = tuples[i];
      if (!userInfo['adminRight'] || !editable) {
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
        let input_list = [];

        tr = document.createElement('tr');
        for (let i = 0; i < attributes.length; i++) {
          let td = document.createElement('td');
          if (i == 0) {
            td.innerHTML = row[attributes[i]];
          } else {
            let new_input = document.createElement('input');
            new_input.setAttribute('type', attribute_types[i]);
            if (attribute_types[i] == 'date') {
              new_input.setAttribute('value', getStringByDate(row[attributes[i]]));
              new_input.setAttribute('class', 'tableDateInput');
            } else if (attribute_types[i] == 'time') {
              new_input.setAttribute('value', row[attributes[i]]);
              new_input.setAttribute('class', 'tableTimeInput');
            }
            else {
              new_input.setAttribute('value', row[attributes[i]]);
              new_input.setAttribute('class', 'tableNumberInput');
            }

            td.appendChild(new_input);
            input_list.push(new_input);
          }
          tr.appendChild(td);


        }

        let td = document.createElement('td');
        let modifyButton = document.createElement('button');
        modifyButton.innerHTML = '保存';
        td.appendChild(modifyButton);
        tr.appendChild(td);

        td = document.createElement('td');
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = '删除';
        td.appendChild(deleteButton);
        tr.appendChild(td);

        modifyButton.onclick = function () {
          for (let i = 1; i < attributes.length; i++) {
            if (i < 2) {
              row[attributes[i]] = Number(input_list[i - 1].value);
            }
            else if (i < 5) {
              row[attributes[i]] = input_list[i - 1].value;
            }
            else {
              row[attributes[i]] = Boolean(Number(input_list[i - 1].value));
            }
          }
          console.log(row);
          console.log(attributes);
          $.ajax({
            url: backendhost + '/api/check/' + row[attributes[0]],
            type: 'PUT',
            data: row,
            success: function (response) {
              console.log(response);

            }
          });
        };

        deleteButton.onclick = function () {
          console.log(row);
          console.log(attributes);

          $.ajax({
            url: backendhost + '/api/check/' + row[attributes[0]],
            type: 'DELETE',
            success: function (response) {
              console.log(response);
              tuples.splice(i, 1);
              addTableCells(tuples);
            }
          });
        }
      }

      table.appendChild(tr);
    }
  }

}

function addLeaveInfo(list, tuples, type, editable = true) {

  let attributes = ['id', 'employee_id', 'leave_type', 'leave_reason', 'begin_date', 'end_date',
    'submit_status', 'approve_reason', 'approve_status'];
  let attribute_types = ['number', 'number', 'text', 'text', 'date', 'date', 'status', 'text', 'status'];
  let attribute_names = ['考勤号', '员工号', '请假类型', '请假理由', '开始时间', '结束时间',
    '提交状态', '批准理由', '批准状态'];

  /*
   let asker_tuples = [];
   for (let i = 0; i < 4; i++) {
   asker_tuples[i] = [];
   }
   let manager_tuples = [];
   for (let i = 0; i < 3; i++) {
   manager_tuples[i] = [];
   }

   for (let row of total_tuples) {
   if (row['submit_status'] == true && row['approve_status'] == null) {
   asker_tuples[0].push(row);
   manager_tuples[0].push(row);
   }
   else if (row['submit_status'] == true && row['approve_status'] == true) {
   asker_tuples[1].push(row);
   manager_tuples[1].push(row);
   }
   else if (row['submit_status'] == true && row['approve_status'] == false) {
   asker_tuples[2].push(row);
   manager_tuples[2].push(row);
   }
   else if (row['submit_status'] == false) {
   asker_tuples[3].push(row);
   }
   }

   let tuples;
   switch (type) {
   case 'manager_all': tuples = manager_tuples[0].concat(manager_tuples[1]).concat(manager_tuples[2]); break;
   case 'manager_process': tuples = manager_tuples[0]; break;
   case 'manager_approve': tuples = manager_tuples[1]; break;
   case 'manager_reject': tuples = manager_tuples[2]; break;
   case 'asker_all': tuples = total_tuples; break;
   case 'asker_process': tuples = asker_tuples[0]; break;
   case 'asker_approve': tuples = asker_tuples[1]; break;
   case 'asker_reject': tuples = asker_tuples[2]; break;
   case 'asker_save': tuples = asker_tuples[3]; break;
   }
   */

  list.innerHTML = '';
  let types = ['SELF_LEAVE', 'SICK_LEAVE', 'MATERNITY_LEAVE', 'WEDDING_LEAVE'];

  let current_tuples = [];
  for (let i = 0; i < tuples.length; i++) {
    let tempIndex = i;
    let row = tuples[tempIndex];
    // let tempStr = `<li>考勤号: ${row['id']}<br>员工号: ${row['employee_id']}<br>请假类型:<select id="leave_type-${row['id']}" value="${row['leave_type']}"><option>SELF_LEAVE</option><option>SICK_LEAVE</option><option>MATERNITY_LEAVE</option><option>WEDDING_LEAVE</option></select><br>请假理由:<br><textarea>${row['leave_reason']}</textarea><br>开始时间:<input type="date" value="2018-01-14"><br>结束时间:<input type="date" value="2018-01-14"><br>提交状态: 0<br>批准理由: null<br>批准状态: null<br><button>申请</button><button>取消</button></li>`;
    // console.log(tempStr);
    let asker_type;
    let manager_type;
    if (row['submit_status'] == true && row['approve_status'] == null) {
      asker_type = 'asker_process';
      manager_type = 'manager_process';
    }
    else if (row['submit_status'] == true && row['approve_status'] == true) {
      asker_type = 'asker_approve';
      manager_type = 'manager_approve';
    }
    else if (row['submit_status'] == true && row['approve_status'] == false) {
      asker_type = 'asker_reject';
      manager_type = 'manager_reject';
    }
    else if (row['submit_status'] == false) {
      asker_type = 'asker_save'
    }

    let display_type;
    if (type == 'manager_all') {
      display_type = manager_type;
    } else if (type == 'asker_all') {
      display_type = asker_type;
    } else {
      display_type = type;
    }

    if (display_type == asker_type || display_type == manager_type) {
      let li = document.createElement('li');
      let typeSelect = document.createElement("select");
      typeSelect.setAttribute("id", "leave_type-" + row['id']);
      for (let j = 0; j < types.length; j++) {
        let option = document.createElement('option');
        option.innerHTML = types[j];
        typeSelect.appendChild(option);
      }
      typeSelect[types.indexOf(row[attributes[2]])].selected = true;

      let reasonInput = document.createElement("textarea");
      typeSelect.setAttribute("id", "leave_reason-" + row['id']);
      reasonInput.innerHTML = row[attributes[3]];


      let beginDateInput = document.createElement("input");
      beginDateInput.setAttribute("type", "date");
      beginDateInput.setAttribute("id", "begin_date-" + row['id']);
      beginDateInput.setAttribute('value', getStringByDate(row[attributes[4]]));

      let endDateInput = document.createElement("input");
      endDateInput.setAttribute("type", "date");
      endDateInput.setAttribute("id", "end_date-" + row['id']);
      endDateInput.setAttribute('value', getStringByDate(row[attributes[5]]));


      if (editable && (display_type == 'asker_save' || display_type == 'asker_reject')) {



        /*
         li.innerHTML = attribute_names[0]+": "+row[attributes[0]]+"<br />"
         +attribute_names[1]+": "+row[attributes[1]]+"<br />"
         +attribute_names[2]+": "+typeSelect.outerHTML+"<br />"
         +attribute_names[3]+": <br />"+reasonInput.outerHTML+"<br />"
         +attribute_names[4]+":"+beginDateInput.outerHTML+"<br />"
         +attribute_names[5]+":"+endDateInput.outerHTML+"<br />"
         +attribute_names[6]+": "+row[attributes[6]]+'<br />'
         +attribute_names[7] + ': ' + row[attributes[7]] + '<br />'
         +attribute_names[8] + ': ' + row[attributes[8]] + '<br />';

         let tempHTML = `<p id="` + row['id'] + `"></p>`;
         */
        let div0 = document.createElement('div');
        div0.innerHTML = (attribute_names[0] + ": " + row[attributes[0]]);
        li.appendChild(div0);

        let div1 = document.createElement('div');
        div1.innerHTML = (attribute_names[1] + ": " + row[attributes[1]]);
        li.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = (attribute_names[2] + ':');
        div2.appendChild(typeSelect);
        li.appendChild(div2);

        let div3 = document.createElement('div');
        div3.innerHTML = (attribute_names[3] + ':' + '<br />');
        div3.appendChild(reasonInput);
        li.appendChild(div3);

        let div4 = document.createElement('div');
        div4.innerHTML = attribute_names[4] + ':';
        div4.appendChild(beginDateInput);
        li.appendChild(div4);

        let div5 = document.createElement('div');
        div5.innerHTML = attribute_names[5] + ':';
        div5.appendChild(endDateInput);
        li.appendChild(div5);

        let div6 = document.createElement('div');

        div6.innerHTML += attribute_names[6] + ': ' + row[attributes[6]] + '<br />';
        div6.innerHTML += attribute_names[7] + ': ' + row[attributes[7]] + '<br />';
        div6.innerHTML += attribute_names[8] + ': ' + row[attributes[8]] + '<br />';
        li.appendChild(div6);
      }
      else {
        for (let i = 0; i < attributes.length; i++) {
          if (attribute_types[i] == 'date') {
            li.innerHTML += attribute_names[i] + ': ' + getStringByDate(row[attributes[i]]) + '<br />';
          }
          else {
            li.innerHTML += attribute_names[i] + ': ' + row[attributes[i]] + '<br />';
          }
        }
      }

      if (editable) {
        switch (display_type) {
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
                    if (response['updateRes'] == "cannot approve own leave") {
                      alert("cannot approve own leave");
                    }
                    else {
                      alert("success");
                      addLeaveInfo(list, tuples, type);

                    }

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
                    if (response['updateRes'] == "cannot approve own leave") {
                      alert("cannot approve own leave");
                    }
                    else {
                      alert("success");
                      addLeaveInfo(list, tuples, type);

                    }
                  }
                });
              }
            };
            li.appendChild(button1);
            li.appendChild(button2);
            break;
          }
          case 'manager_approve': {
            break;
          }
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
                    if (response['updateRes'] == "cannot approve own leave") {
                      alert("cannot approve own leave");
                    }
                    else {
                      alert("success");
                      addLeaveInfo(list, tuples, type);

                    }
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
                    if (response['updateRes'] == "cannot approve own leave") {
                      alert("cannot approve own leave");
                    }
                    else {
                      alert("success");
                    }
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
              row['submit_status'] = true;
              row['leave_type'] = typeSelect.value;
              row['leave_reason'] = reasonInput.value;
              row['begin_date'] = beginDateInput.value;
              row['end_date'] = endDateInput.value;
              $.ajax({
                url: backendhost + '/api/leave/' + row['id'],
                type: 'PUT',
                data: row,
                success: function (response) {
                  console.log(response);
                  alert("success");
                  addLeaveInfo(list, tuples, type);

                }
              });
              /*
               function getNewRow() {
               let tempObj = {
               'submit_status': true,
               'leave_type': document.getElementById("leave_type-" + row['id']).value,
               'leave_reason': document.getElementById("leave_reason-" + row['id']).value,
               'begin_date': document.getElementById("begin_date-" + row['id']).value,
               'end_date': document.getElementById("end_reason-" + row['id']).value,
               };
               return tempObj;
               }
               */
            };
            let button2 = document.createElement('button');
            button2.innerHTML = '取消';
            button2.onclick = function () {
              $.ajax({
                url: backendhost + '/api/leave/' + row['id'],
                type: 'DELETE',
                success: function (response) {
                  console.log(response);
                  tuples.splice(i, 1);
                  addLeaveInfo(list, tuples, type);

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
              row['submit_status'] = false;
              console.log(row);
              $.ajax({
                url: backendhost + '/api/leave/' + row['id'],
                type: 'PUT',
                data: row,
                success: function (response) {
                  console.log(response);
                  alert("success");
                  addLeaveInfo(list, tuples, type);

                }
              });
            };
            li.appendChild(button2);
            break;
          }
          case 'asker_approve': {
            let button2 = document.createElement('button');
            button2.innerHTML = '删除记录';
            button2.onclick = function () {
              $.ajax({
                url: backendhost + '/api/leave/' + row['id'],
                type: 'DELETE',
                success: function (response) {
                  console.log(response);
                  alert("success");
                  tuples.splice(i, 1);
                  addLeaveInfo(list, tuples, type);

                }
              });

            };
            li.appendChild(button2);
            break;
          }
          case 'asker_reject': {
            let button1 = document.createElement("button");
            button1.innerHTML = '重新申请';
            row['submit_status'] = true;
            button1.onclick = function () {
              $.ajax({
                url: backendhost + '/api/leave/' + row['id'],
                type: 'PUT',
                data: row,
                success: function (response) {
                  console.log(response);
                  alert("success");
                  addLeaveInfo(list, tuples, type);

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
                  tuples.splice(i, 1);
                  addLeaveInfo(list, tuples, type);

                }
              });
            };
            li.appendChild(button1);
            li.appendChild(button2);
            break;
          }
        }
      }
      list.appendChild(li);

      current_tuples.push(row);
    }
  }
  return current_tuples;
}

function addTripInfo(list, tuples, type, editable = true) {
  let attributes = ['id', 'employee_id', 'trip_type', 'trip_reason', 'begin_date', 'end_date',
    'submit_status', 'approve_reason', 'approve_status'];
  let attribute_types = ['number', 'number', 'text', 'text', 'date', 'date', 'status', 'text', 'status'];
  let attribute_names = ['出差号', '员工号', '出差类型', '出差理由', '开始时间', '结束时间',
    '提交状态', '批准理由', '批准状态'];
  list.innerHTML = '';
  let types = ['COMPANY_ASSIGN', 'PERSONAL_APPLICATION'];

  let current_tuples = [];
  for (let i = 0; i < tuples.length; i++) {
    let tempIndex = i;
    let row = tuples[tempIndex];
    // let tempStr = `<li>考勤号: ${row['id']}<br>员工号: ${row['employee_id']}<br>请假类型:<select id="leave_type-${row['id']}" value="${row['leave_type']}"><option>SELF_LEAVE</option><option>SICK_LEAVE</option><option>MATERNITY_LEAVE</option><option>WEDDING_LEAVE</option></select><br>请假理由:<br><textarea>${row['leave_reason']}</textarea><br>开始时间:<input type="date" value="2018-01-14"><br>结束时间:<input type="date" value="2018-01-14"><br>提交状态: 0<br>批准理由: null<br>批准状态: null<br><button>申请</button><button>取消</button></li>`;
    // console.log(tempStr);
    let asker_type;
    let manager_type;
    if (row['submit_status'] == true && row['approve_status'] == null) {
      asker_type = 'asker_process';
      manager_type = 'manager_process';
    }
    else if (row['submit_status'] == true && row['approve_status'] == true) {
      asker_type = 'asker_approve';
      manager_type = 'manager_approve';
    }
    else if (row['submit_status'] == true && row['approve_status'] == false) {
      asker_type = 'asker_reject';
      manager_type = 'manager_reject';
    }
    else if (row['submit_status'] == false) {
      asker_type = 'asker_save'
    }

    let display_type;
    if (type == 'manager_all') {
      display_type = manager_type;
    } else if (type == 'asker_all') {
      display_type = asker_type;
    } else {
      display_type = type;
    }

    if (display_type == asker_type || display_type == manager_type) {
      let li = document.createElement('li');
      let typeSelect = document.createElement("select");
      typeSelect.setAttribute("id", "leave_type-" + row['id']);
      for (let j = 0; j < types.length; j++) {
        let option = document.createElement('option');
        option.innerHTML = types[j];
        typeSelect.appendChild(option);
      }
      typeSelect[types.indexOf(row[attributes[2]])].selected = true;

      let reasonInput = document.createElement("textarea");
      typeSelect.setAttribute("id", "leave_reason-" + row['id']);
      reasonInput.innerHTML = row[attributes[3]];


      let beginDateInput = document.createElement("input");
      beginDateInput.setAttribute("type", "date");
      beginDateInput.setAttribute("id", "begin_date-" + row['id']);
      beginDateInput.setAttribute('value', getStringByDate(row[attributes[4]]));

      let endDateInput = document.createElement("input");
      endDateInput.setAttribute("type", "date");
      endDateInput.setAttribute("id", "end_date-" + row['id']);
      endDateInput.setAttribute('value', getStringByDate(row[attributes[5]]));


      if (editable && (display_type == 'asker_save' || display_type == 'asker_reject')) {



        /*
         li.innerHTML = attribute_names[0]+": "+row[attributes[0]]+"<br />"
         +attribute_names[1]+": "+row[attributes[1]]+"<br />"
         +attribute_names[2]+": "+typeSelect.outerHTML+"<br />"
         +attribute_names[3]+": <br />"+reasonInput.outerHTML+"<br />"
         +attribute_names[4]+":"+beginDateInput.outerHTML+"<br />"
         +attribute_names[5]+":"+endDateInput.outerHTML+"<br />"
         +attribute_names[6]+": "+row[attributes[6]]+'<br />'
         +attribute_names[7] + ': ' + row[attributes[7]] + '<br />'
         +attribute_names[8] + ': ' + row[attributes[8]] + '<br />';

         let tempHTML = `<p id="` + row['id'] + `"></p>`;
         */
        let div0 = document.createElement('div');
        div0.innerHTML = (attribute_names[0] + ": " + row[attributes[0]]);
        li.appendChild(div0);

        let div1 = document.createElement('div');
        div1.innerHTML = (attribute_names[1] + ": " + row[attributes[1]]);
        li.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = (attribute_names[2] + ':');
        div2.appendChild(typeSelect);
        li.appendChild(div2);

        let div3 = document.createElement('div');
        div3.innerHTML = (attribute_names[3] + ':' + '<br />');
        div3.appendChild(reasonInput);
        li.appendChild(div3);

        let div4 = document.createElement('div');
        div4.innerHTML = attribute_names[4] + ':';
        div4.appendChild(beginDateInput);
        li.appendChild(div4);

        let div5 = document.createElement('div');
        div5.innerHTML = attribute_names[5] + ':';
        div5.appendChild(endDateInput);
        li.appendChild(div5);

        let div6 = document.createElement('div');

        div6.innerHTML += attribute_names[6] + ': ' + row[attributes[6]] + '<br />';
        div6.innerHTML += attribute_names[7] + ': ' + row[attributes[7]] + '<br />';
        div6.innerHTML += attribute_names[8] + ': ' + row[attributes[8]] + '<br />';
        li.appendChild(div6);
      }
      else {
        for (let i = 0; i < attributes.length; i++) {
          if (attribute_types[i] == 'date') {
            li.innerHTML += attribute_names[i] + ': ' + getStringByDate(row[attributes[i]]) + '<br />';
          }
          else {
            li.innerHTML += attribute_names[i] + ': ' + row[attributes[i]] + '<br />';
          }
        }
      }

      if (editable) {
        switch (display_type) {
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
                  url: backendhost + '/api/trip/approve/' + row['id'],
                  type: 'PUT',
                  data: row,
                  success: function (response) {
                    console.log(response);
                    if (response['updateRes'] == "cannot approve own leave") {
                      alert("cannot approve own leave");
                    }
                    else {
                      alert("success");
                      addTripInfo(list, tuples, type);

                    }

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
                  url: backendhost + '/api/trip/approve/' + row['id'],
                  type: 'PUT',
                  data: row,
                  success: function (response) {
                    console.log(response);
                    if (response['updateRes'] == "cannot approve own leave") {
                      alert("cannot approve own leave");
                    }
                    else {
                      alert("success");
                      addTripInfo(list, tuples, type);

                    }
                  }
                });
              }
            };
            li.appendChild(button1);
            li.appendChild(button2);
            break;
          }
          case 'manager_approve': {
            break;
          }
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
                  url: backendhost + '/api/trip/approve/' + row['id'],
                  type: 'PUT',
                  data: row,
                  success: function (response) {
                    console.log(response);
                    if (response['updateRes'] == "cannot approve own leave") {
                      alert("cannot approve own leave");
                    }
                    else {
                      alert("success");
                      addTripInfo(list, tuples, type);

                    }
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
                  url: backendhost + '/api/trip/approve/' + row['id'],
                  type: 'PUT',
                  data: row,
                  success: function (response) {
                    console.log(response);
                    if (response['updateRes'] == "cannot approve own leave") {
                      alert("cannot approve own leave");
                    }
                    else {
                      alert("success");
                    }
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
              row['submit_status'] = true;
              row['leave_type'] = typeSelect.value;
              row['leave_reason'] = reasonInput.value;
              row['begin_date'] = beginDateInput.value;
              row['end_date'] = endDateInput.value;
              $.ajax({
                url: backendhost + '/api/trip/' + row['id'],
                type: 'PUT',
                data: row,
                success: function (response) {
                  console.log(response);
                  alert("success");
                  addTripInfo(list, tuples, type);

                }
              });
              /*
               function getNewRow() {
               let tempObj = {
               'submit_status': true,
               'leave_type': document.getElementById("leave_type-" + row['id']).value,
               'leave_reason': document.getElementById("leave_reason-" + row['id']).value,
               'begin_date': document.getElementById("begin_date-" + row['id']).value,
               'end_date': document.getElementById("end_reason-" + row['id']).value,
               };
               return tempObj;
               }
               */
            };
            let button2 = document.createElement('button');
            button2.innerHTML = '取消';
            button2.onclick = function () {
              $.ajax({
                url: backendhost + '/api/trip/' + row['id'],
                type: 'DELETE',
                success: function (response) {
                  console.log(response);
                  tuples.splice(i, 1);
                  addTripInfo(list, tuples, type);

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
              row['submit_status'] = false;
              console.log(row);
              $.ajax({
                url: backendhost + '/api/trip/' + row['id'],
                type: 'PUT',
                data: row,
                success: function (response) {
                  console.log(response);
                  alert("success");
                  addTripInfo(list, tuples, type);

                }
              });
            };
            li.appendChild(button2);
            break;
          }
          case 'asker_approve': {
            let button2 = document.createElement('button');
            button2.innerHTML = '删除记录';
            button2.onclick = function () {
              $.ajax({
                url: backendhost + '/api/trip/' + row['id'],
                type: 'DELETE',
                success: function (response) {
                  console.log(response);
                  alert("success");
                  tuples.splice(i, 1);
                  addTripInfo(list, tuples, type);

                }
              });

            };
            li.appendChild(button2);
            break;
          }
          case 'asker_reject': {
            let button1 = document.createElement("button");
            button1.innerHTML = '重新申请';
            row['submit_status'] = true;
            button1.onclick = function () {
              $.ajax({
                url: backendhost + '/api/trip/' + row['id'],
                type: 'PUT',
                data: row,
                success: function (response) {
                  console.log(response);
                  alert("success");
                  addTripInfo(list, tuples, type);

                }
              });
            };
            let button2 = document.createElement('button');
            button2.innerHTML = '取消';
            button2.onclick = function () {
              $.ajax({
                url: backendhost + '/api/trip/' + row['id'],
                type: 'DELETE',
                success: function (response) {
                  console.log(response);
                  tuples.splice(i, 1);
                  addTripInfo(list, tuples, type);

                }
              });
            };
            li.appendChild(button1);
            li.appendChild(button2);
            break;
          }
        }
      }
      list.appendChild(li);

      current_tuples.push(row);
    }
    }
  return current_tuples;
}

function addLogInfo(list, tuples) {
  let attributes = ['id', 'employee_id', 'operate_type', 'operate_value', 'create_time', 'update_time'];
  let attribute_types = ['number', 'number', 'text', 'text', 'datetime', 'datetime'];
  let attribute_names = ['id', 'employee_id', 'operate_type', 'operate_value', 'create_time', 'update_time'];

  list.innerHTML = '';
  for (let i = 0; i < tuples.length; i++) {
    let row = tuples[i];
    let li = document.createElement('li');
    let inputs = [];
    for (let j = 0; j < attributes.length; j++) {
      if (attributes[j] == 'operate_value') {
        let text = document.createElement('textarea');
        text.innerHTML = row[attributes[j]];
        inputs.push(text);
      } else {
        let new_input = document.createElement('input');
        new_input.setAttribute("type", attribute_types[j]);
        new_input.setAttribute("value", row[attributes[j]]);
        inputs.push(new_input);
      }

    }


    let div0 = document.createElement('div');
    div0.innerHTML = (attribute_names[0] + ": " + row[attributes[0]]);
    li.appendChild(div0);

    let div1 = document.createElement('div');
    div1.innerHTML = (attribute_names[1] + ': ' + row[attributes[1]]);
    li.appendChild(div1);

    let div2 = document.createElement('div');
    div2.innerHTML = (attribute_names[2] + ':');
    div2.appendChild(inputs[2]);
    li.appendChild(div2);

    let div3 = document.createElement('div');
    div3.innerHTML = (attribute_names[3] + ': ' + '<br />');
    div3.appendChild(inputs[3]);
    li.appendChild(div3);

    let div4 = document.createElement('div');
    div4.innerHTML = attribute_names[4] + ': ' + row[attributes[4]];
    li.appendChild(div4);

    let div5 = document.createElement('div');
    div5.innerHTML = attribute_names[5] + ': ' + row[attributes[5]];
    li.appendChild(div5);


    let button1 = document.createElement("button");
    button1.innerHTML = '保存';
    button1.onclick = function () {
      row['operate_type'] = inputs[2].value;
      row['operate_value'] = inputs[3].value;
      console.log(inputs);
      console.log(row);
      $.ajax({
        url: backendhost + '/api/log/' + row['id'],
        type: 'PUT',
        data: row,
        success: function (response) {
          console.log(response);
          alert("success");
        }
      });
    };
    let button2 = document.createElement('button');
    button2.innerHTML = '删除';
    button2.onclick = function () {
      $.ajax({
        url: backendhost + '/api/log/' + row['id'],
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
    list.appendChild(li);
  }
}

function getSortedTuplesByAttribute(tuples, attribute, reverse) {

  if (reverse) {
    //if (attribute == 'begin_date' || attribute == 'end_date' || attribute == 'check_date') {
    //    return tuples.sort((a, b) => (getStringByDate(a[attribute]) < getStringByDate(b[attribute]) || a[attribute] === null) ? 1 : -1);
    //} else {
    return tuples.sort((a, b) => (a[attribute] < b[attribute] || a[attribute] === null) ? 1 : -1);
    //}
  } else {
    //if (attribute == 'begin_date' || attribute == 'end_date' || attribute == 'check_date') {
    //    return tuples.sort((a, b) => (getStringByDate(a[attribute]) > getStringByDate(b[attribute]) || a[attribute] === null) ? 1 : -1);
    //} else {
    return tuples.sort((a, b) => (a[attribute] > b[attribute] || a[attribute] === null) ? 1 : -1);
    //}
  }
}

function getSortedTuplesByAttributeDifference(tuples, attribute1, attribute2, reverse) {
  if (reverse) {
    //if (attribute == 'begin_date' || attribute == 'end_date' || attribute == 'check_date') {
    //    return tuples.sort((a, b) => (getStringByDate(a[attribute]) < getStringByDate(b[attribute]) || a[attribute] === null) ? 1 : -1);
    //} else {
    return tuples.sort((a, b) => (a[attribute2] - a[attribute1] < b[attribute2] - b[attribute1] || a[attribute2] === null || a[attribute2] === null) ? 1 : -1);
    //}
  } else {
    //if (attribute == 'begin_date' || attribute == 'end_date' || attribute == 'check_date') {
    //    return tuples.sort((a, b) => (getStringByDate(a[attribute]) > getStringByDate(b[attribute]) || a[attribute] === null) ? 1 : -1);
    //} else {
    return tuples.sort((a, b) => (a[attribute2] - a[attribute1] > b[attribute2] - b[attribute1] || a[attribute2] === null || a[attribute2] === null) ? 1 : -1);
    //}
  }
}

function getSortedTuplesByDateDifference(tuples, attribute1, attribute2, reverse) {
  if (reverse) {
    //if (attribute == 'begin_date' || attribute == 'end_date' || attribute == 'check_date') {
    //    return tuples.sort((a, b) => (getStringByDate(a[attribute]) < getStringByDate(b[attribute]) || a[attribute] === null) ? 1 : -1);
    //} else {
    return tuples.sort((a, b) => (getDifferenceMilliseconds(a[attribute1], a[attribute2]) < getDifferenceMilliseconds(b[attribute2], b[attribute1]) || a[attribute2] === null || a[attribute2] === null) ? 1 : -1);
    //}
  } else {
    //if (attribute == 'begin_date' || attribute == 'end_date' || attribute == 'check_date') {
    //    return tuples.sort((a, b) => (getStringByDate(a[attribute]) > getStringByDate(b[attribute]) || a[attribute] === null) ? 1 : -1);
    //} else {
    return tuples.sort((a, b) => (getDifferenceMilliseconds(a[attribute1], a[attribute2]) > getDifferenceMilliseconds(b[attribute2], b[attribute1]) || a[attribute2] === null || a[attribute2] === null) ? 1 : -1);
    //}
  }
}

function getKeyInfoByEmployeeTuples(tuples) {
  let new_tuples = [];
  for (let i = 0; i < tuples.length; i++) {
    let tuple = tuples[i];
    let new_tuple = {};
    new_tuple['id'] = tuple['id'];
    new_tuple['name'] = tuple['name'];
    if (tuple['adminRight']) {
      new_tuple['right'] = 'admin';
    }
    else if (tuple['personnelRight']) {
      new_tuple['right'] = 'personnel';
    }
    else if (tuple['headRight']) {
      new_tuple['right'] = 'head';
    }
    else {
      new_tuple['right'] = 'ordinary';
    }

    if (tuple['department']) {
      new_tuple['department_id'] = tuple['department']['id'];
      new_tuple['department_name'] = tuple['department']['name'];
      new_tuple['department_code'] = tuple['department']['code'];
    } else {
      new_tuple['department_id'] = "无";
      new_tuple['department_name'] = "无";
      new_tuple['department_code'] = "无";
    }
    new_tuples.push(new_tuple);
  }
  return new_tuples;
}

function getTuplesByAttributeAccordingEmployee(tuples, attribute, value) {
  let new_tuples = [];
  $.get(backendhost + "/api/employee", function (data) {
    let employee_tuples = getKeyInfoByEmployeeTuples(data['getRes']);

    for (let i = 0; i < tuples.length; i++) {
      let tuple = tuples[i];
      let exist = false;
      for (let j = 0; j < employee_tuples.length; j++) {
        if (tuple['employee_id'] === employee_tuples[j]['id']) {
          if (employee_tuples[j][attribute] == value) {
            exist = true;
          }
          break;
        }
      }
      if (exist) {
        new_tuples.push(tuple);
      }
    }
  });
  return new_tuples;
}

function getTuplesByValue(tuples, attribute, value) {
  let newTuples = [];
  for (let i = 0; i < tuples.length; i++) {
    if (tuples[i][attribute] == value || getStringByDate(tuples[i][attribute]) == getStringByDate(value)) {
      newTuples.push(tuples[i]);
    }
  }
  return newTuples;
}

function getTuplesByValueInterval(tuples, attribute, value1, value2) {
  let newTuples = [];
  for (let i = 0; i < tuples.length; i++) {
    let tuple = tuples[i];
    if ((tuple[attribute] >= value1 && tuple[attribute] <= value2) ||
      (getStringByDate(tuple[attribute]) >= getStringByDate(value1) && getStringByDate(tuple[attribute]) <= getStringByDate(value2))
    ) {
      newTuples.push(tuple);
    }
  }
  return newTuples;
}

function getTuplesBetweenTwoAttributesByValue(tuples, attribute1, attribute2, value) {
  let newTuples = [];
  for (let i = 0; i < tuples.length; i++) {
    let tuple = tuples[i];
    if (tuple[attribute1] <= value && tuple[attribute2] >= value ||
      getStringByDate(tuple[attribute1]) <= getStringByDate(value) &&
      getStringByDate(tuple[attribute2]) >= getStringByDate(value)) {
      newTuples.push(tuple);
    }
  }
  return newTuples;
}

function getTuplesBetweenTwoAttributesByValueInterval(tuples, attribute1, attribute2, value1, value2) {
  let newTuples = [];
  for (let i = 0; i < tuples.length; i++) {
    let tuple = tuples[i];
    if (tuple[attribute1] <= value1 && tuple[attribute2] >= value1 ||
      tuple[attribute1] <= value2 && tuple[attribute2] >= value2 ||
      getStringByDate(tuple[attribute1]) <= getStringByDate(value1) && getStringByDate(tuple[attribute2]) >= getStringByDate(value1) ||
      getStringByDate(tuple[attribute1]) <= getStringByDate(value2) && getStringByDate(tuple[attribute2]) >= getStringByDate(value2)) {
      newTuples.push(tuple);
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
        alert("现在不是上班时间");
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
      console.log(data);
      if (checkOutRes == 'time error') {
        alert("现在不是签退时间");
      }
      else if (checkOutRes['affectedRows'] === 0) {
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
    let button_types = ['submit', 'reset', 'save'];
    let leave_types = ['SELF_LEAVE', 'SICK_LEAVE', 'MATERNITY_LEAVE', 'WEDDING_LEAVE'];
        listHeading.innerHTML = "申请请假";
        list.innerHTML = '';
    let startDateInput = addInput(list, "开始日期", "date", getStringByDate(new Date()));
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
          alert("submit success");
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
    buttons[2].onclick = function () {
      $.post(backendhost + "/api/leave", {
        employee_id: userInfo['id'],
        leave_type: selects[0].value,
        leave_reason: reason.value,
        begin_date: startDateInput.value,
        end_date: endDateInput.value,
        submit_status: false,
        approve_reason: " ",
      }, function (data) {
        if (data) {
          console.log(data);
          alert("save success");
        }
        else {
          alert("No such id");
        }

      });
    }

    });
  /*
   if (userInfo['headRight'] || userInfo['personnelRight'] || userInfo['adminRight']) {
   addList(list, "", "审核请假", "", function () {

   listHeading.innerHTML = "员工请假信息";

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

   let tuples;
   if (userInfo['adminRight']) {
   tuples = data['getRes']['employeeLeaves'];
   } else {
   tuples = data['getRes'];
   }
   console.log(tuples);

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
   }

   let button_states = ['manager_process', 'manager_approve', 'manager_reject'];
   for (let i = 0; i < buttons.length; i++) {
   buttons[i].onclick = function () {
   list.innerHTML = '';
   addLeaveInfo(list, tuples, button_states[i]);
   }
   }
   });
   });
   }
   */
};

let tripManage = document.getElementById("tripManage");
tripManage.onclick = function () {
    listHeading.innerHTML = "出差管理";
    list.innerHTML = '';
  addList(list, "", "申请出差", "", function () {
        //todo
    let button_types = ['submit', 'reset', 'save'];
    let trip_types = ['COMPANY_ASSIGN', 'PERSONAL_APPLICATION'];
    listHeading.innerHTML = "申请出差";
    list.innerHTML = '';
    let startDateInput = addInput(list, "开始日期", "date", getStringByDate(new Date()));
    let endDateInput = addInput(list, "结束日期", "date", getStringByDate(new Date()));
    let selects = addSelects(list, ["出差类型"], [trip_types]);
    let reason = addInput(list, "出差理由", "text", "");
    let buttons = addButtons(list, button_types);

    buttons[0].onclick = function () {
      console.log(selects[0].value);
      console.log(userInfo['id']);
      console.log(reason.value);
      $.post(backendhost + "/api/trip", {
        employee_id: userInfo['id'],
        trip_type: selects[0].value,
        trip_reason: reason.value,
        begin_date: startDateInput.value,
        end_date: endDateInput.value,
        submit_status: true,
        approve_reason: " ",
      }, function (data) {
        if (data) {
          console.log(data);
          alert("submit success");
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
    buttons[2].onclick = function () {
      $.post(backendhost + "/api/trip", {
        employee_id: userInfo['id'],
        trip_type: selects[0].value,
        trip_reason: reason.value,
        begin_date: startDateInput.value,
        end_date: endDateInput.value,
        submit_status: false,
        approve_reason: " ",
      }, function (data) {
        if (data) {
          console.log(data);
          alert("save success");
        }
        else {
          alert("No such id");
        }

      });
    }

    });
  /*
   if (userInfo['headRight'] || userInfo['personnelRight'] || userInfo['adminRight']) {
   addList(list, "", "审核出差", "", function () {
   //todo
   listHeading.innerHTML = "员工出差信息";
   list.innerHTML = '';
   let buttons = [];
   let button_prompts = ['待处理', '已接受', '已拒绝'];
   for (let i = 0; i < button_prompts.length; i++) {
   let button = document.createElement("button");
   button.innerHTML = button_prompts[i];
   listHeading.appendChild(button);
   buttons.push(button);
   }


   $.get(backendhost + "/api/trip", function (data) {
   let tuples = data['getRes'];
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
   addTripInfo(list, manager_tuples[i], button_states[i]);
   }
   }
   });
   });
   }
   */
};

let humanManage = document.getElementById("humanManage");
humanManage.onclick = function () {
    listHeading.innerHTML = "人事管理";
    list.innerHTML = '';
  if (userInfo['adminRight'] || userInfo['personnelRight']) {
    addList(list, "", "新增员工信息", "", function () {
            //todo
      listHeading.innerHTML = "新增员工信息";
      list.innerHTML = '';
      let nameInput = addInput(list, 'name', 'text', '');
      let passwordInput = addInput(list, 'password', 'password', '');
      let ensurePasswordInput = addInput(list, 'password', 'password', '');
      let buttons = addButtons(list, ['submit', 'reset']);
      buttons[0].onclick = function () {
        if (passwordInput.value != ensurePasswordInput.value) {
          alert("两次密码输入不一致");
        }
        $.post(backendhost + "/api/employee", {
          name: nameInput.value,
          password: md5(passwordInput.value)
        }, function (data) {
          if (data) {
            alert("success! and your id is " + data['insertRes']['insertId']);
            console.log(data);
          }
          else {
            alert("No such");
          }
        });
      };
      buttons[1].onclick = function () {
        nameInput.value = '';
        passwordInput.value = '';
        ensurePasswordInput.value = '';
      }
        });
    addList(list, "", "修改员工信息", "", function () {
            //todo
      $.get(backendhost + "/api/employee", function (data) {
        let tuples = data['getRes'];
        console.log(data);

        listHeading.innerHTML = "修改员工信息<br/><br/>请输入员工号id:";
        list.innerHTML = '';
        let idInput = document.createElement('input');
        idInput.setAttribute('type', 'number');
        listHeading.appendChild(idInput);
        let button = document.createElement('button');
        button.innerHTML = 'search';
        listHeading.appendChild(idInput);
        listHeading.appendChild(button);
        addTable(list, getKeyInfoByEmployeeTuples(tuples), 'employee', false);

        button.onclick = function () {
          console.log(idInput.value);
          let tuple = getTuplesByValue(tuples, 'id', idInput.value)[0];
          console.log(tuple);
          list.innerHTML = '';
          let nameInput = addInput(list, 'name', 'text', tuple['name']);
          let passwordInput = addInput(list, 'password', 'password', '');
          let ensurePasswordInput = addInput(list, 'password', 'password', '');
          let buttons = addButtons(list, ['submit', 'reset']);
          buttons[0].onclick = function () {
            if (passwordInput.value != ensurePasswordInput.value) {
              alert("两次密码输入不一致");
            } else {
              let tempData = {
                id: tuple['id'],
                name: nameInput.value,
                password: md5(passwordInput.value)
              };
              console.log(JSON.stringify(tempData));
              $.ajax({
                url: backendhost + '/api/employee/' + tuple['id'],
                type: 'PUT',
                data: tempData,
                success: function (response) {
                  console.log(response);

                }
              });
            }
          };
        };

      });


        });
    addList(list, "", "查询员工信息", "", function () {
            //todo
      list.innerHTML = '';

      $.get(backendhost + "/api/employee", function (data) {
        let tuples = data['getRes'];
        console.log(data);
        let employeeTuples = getKeyInfoByEmployeeTuples(tuples);
        addTable(list, employeeTuples, type = 'employee', editable = false);
        listHeading.innerHTML = "查询员工信息 <br /><br />" +
          "<button id='addButton'>新增</button><br />" +
          "<button id='allButton'>显示全部</button><br />" +
          "按员工号修改: <input type='number' id='modifyInput' /><button id='modifyButton'>确认</button><br />" +

          "按员工号查询: <input type='number' id='idInput' /><button id='idButton'>确认</button><br />" +
          "按员工姓名查询: <input type='text' id='nameInput' /><button id='nameButton'>确认</button><br />";


        let addButton = document.getElementById('addButton');
        let allButton = document.getElementById('allButton');
        let modifyInput = document.getElementById('modifyInput');
        let modifyButton = document.getElementById('modifyButton');
        let idInput = document.getElementById('idInput');
        let idButton = document.getElementById('idButton');
        let nameInput = document.getElementById('nameInput');
        let nameButton = document.getElementById('nameButton');


        addButton.onclick = function () {
          listHeading.innerHTML = "新增员工信息";
          list.innerHTML = '';
          let nameInput = addInput(list, 'name', 'text', '');
          let passwordInput = addInput(list, 'password', 'password', '');
          let ensurePasswordInput = addInput(list, 'password', 'password', '');
          let buttons = addButtons(list, ['submit', 'reset']);
          buttons[0].onclick = function () {
            if (passwordInput.value != ensurePasswordInput.value) {
              alert("两次密码输入不一致");
            }
            $.post(backendhost + "/api/employee", {
              name: nameInput.value,
              password: md5(passwordInput.value)
            }, function (data) {
              if (data) {
                console.log(data);
              }
              else {
                alert("No such");
              }
            });
          };
          buttons[1].onclick = function () {
            nameInput.value = '';
            passwordInput.value = '';
            ensurePasswordInput.value = '';
          }
        };

        allButton.onclick = function () {
          list.innerHTML = "";
          addTable(list, employeeTuples, type = 'employee', editable = false);
        };

        modifyButton.onclick = function () {
          console.log(modifyInput.value);
          let tuple = getTuplesByValue(employeeTuples, 'id', modifyInput.value)[0];
          console.log(tuple);
          list.innerHTML = '';
          let nameInput = addInput(list, 'name', 'text', tuple['name']);
          let passwordInput = addInput(list, 'password', 'password', '');
          let ensurePasswordInput = addInput(list, 'password', 'password', '');
          let buttons = addButtons(list, ['submit', 'reset']);
          buttons[0].onclick = function () {
            if (passwordInput.value != ensurePasswordInput.value) {
              alert("两次密码输入不一致");
            } else {
              let tempData = {
                id: tuple['id'],
                name: nameInput.value,
                password: md5(passwordInput.value)
              };
              console.log(JSON.stringify(tempData));
              $.ajax({
                url: backendhost + '/api/employee/' + tuple['id'],
                type: 'PUT',
                data: tempData,
                success: function (response) {
                  console.log(response);

                }
              });
            }
          };
        };

        idButton.onclick = function () {
          let a_tuple_list = getTuplesByValue(employeeTuples, 'id', idInput.value);
          list.innerHTML = '';
          addTable(list, a_tuple_list, 'employee', false);
        };

        nameButton.onclick = function () {
          let a_tuple_list = getTuplesByValue(employeeTuples, 'name', nameInput.value);
          list.innerHTML = '';
          addTable(list, a_tuple_list, 'employee', false);
        };

      });
        });
    addList(list, "", "新增部门信息", "", function () {
            //todo
      listHeading.innerHTML = "新增部门信息";
      list.innerHTML = '';
      let nameInput = addInput(list, 'name', 'text', '');
      let codeInput = addInput(list, 'code', 'text', '');
      let buttons = addButtons(list, ['submit', 'reset']);
      buttons[0].onclick = function () {
        $.post(backendhost + "/api/department", {
          name: nameInput.value,
          code: codeInput.value
        }, function (data) {
          if (data) {
            console.log(data);
          }
          else {
            alert("No such");
          }
        });
      };
      buttons[1].onclick = function () {
        nameInput.value = '';
        codeInput.value = '';
      }
        });
    addList(list, "", "修改部门信息", "", function () {
            //todo
      //todo
      $.get(backendhost + "/api/department", function (data) {
        let tuples = data['getRes'];
        console.log(data);
        listHeading.innerHTML = "修改部门信息";
        list.innerHTML = '';

        let idInput = document.createElement('input');
        idInput.setAttribute('type', 'number');
        listHeading.appendChild(idInput);
        let button = document.createElement('button');
        button.innerHTML = 'search';

        listHeading.appendChild(idInput);
        listHeading.appendChild(button);

        addTable(list, tuples, type = 'department', editable = false);
        button.onclick = function () {
          console.log(idInput.value);
          let tuple = getTuplesByValue(tuples, 'id', idInput.value)[0];
          console.log(tuple);
          list.innerHTML = '';
          let nameInput = addInput(list, 'name', 'text', tuple['name']);
          let codeInput = addInput(list, 'code', 'text', tuple['code']);
          let buttons = addButtons(list, ['submit', 'reset']);
          buttons[0].onclick = function () {
            let tempData = {id: tuple['id'], name: nameInput.value, code: codeInput.value};
            console.log(JSON.stringify(tempData));
            $.ajax({
              url: backendhost + '/api/department/' + tuple['id'],
              type: 'PUT',
              data: tempData,
              success: function (response) {
                console.log(response);
              }
            });
          };
        };
      });
        });
    addList(list, "", "查询部门信息", "", function () {
            //todo
      list.innerHTML = '';

      $.get(backendhost + "/api/department", function (data) {
        let tuples = data['getRes'];
        console.log(data);
        addTable(list, tuples, type = 'department', editable = false);

        listHeading.innerHTML = "查询部门信息 <br /><br />" +
          "<button id='addButton'>新增</button><br />" +
          "<button id='allButton'>显示全部</button><br />" +
          "按部门号修改: <input type='number' id='modifyInput' /><button id='modifyButton'>确认</button><br />" +
          "按部门号查询: <input type='number' id='idInput' /><button id='idButton'>确认</button><br />" +
          "按部门名查询: <input type='text' id='nameInput' /><button id='nameButton'>确认</button><br />";

        let addButton = document.getElementById('addButton');
        let allButton = document.getElementById('allButton');
        let modifyInput = document.getElementById('modifyInput');
        let modifyButton = document.getElementById('modifyButton');
        let idInput = document.getElementById('idInput');
        let idButton = document.getElementById('idButton');
        let nameInput = document.getElementById('nameInput');
        let nameButton = document.getElementById('nameButton');

        addButton.onclick = function () {
          listHeading.innerHTML = "新增部门信息";
          list.innerHTML = '';
          let nameInput = addInput(list, 'name', 'text', '');
          let codeInput = addInput(list, 'code', 'text', '');
          let buttons = addButtons(list, ['submit', 'reset']);
          buttons[0].onclick = function () {
            $.post(backendhost + "/api/employee", {
              name: nameInput.value,
              code: codeInput.value
            }, function (data) {
              if (data) {
                console.log(data);
              }
              else {
                alert("No such");
              }
            });
          };
          buttons[1].onclick = function () {
            nameInput.value = '';
            codeInput.value = '';
          }
        };

        allButton.onclick = function () {
          list.innerHTML = "";
          addTable(list, tuples, type = 'department', editable = false);
        };

        modifyButton.onclick = function () {

          console.log(modifyInput.value);
          let tuple = getTuplesByValue(tuples, 'id', modifyInput.value)[0];
          console.log(tuple);
          list.innerHTML = '';
          let nameInput = addInput(list, 'name', 'text', tuple['name']);
          let codeInput = addInput(list, 'code', 'text', tuple['code']);
          let buttons = addButtons(list, ['submit', 'reset']);
          buttons[0].onclick = function () {
            let tempData = {id: tuple['id'], name: nameInput.value, code: codeInput.value};
            console.log(JSON.stringify(tempData));
            $.ajax({
              url: backendhost + '/api/department/' + tuple['id'],
              type: 'PUT',
              data: tempData,
              success: function (response) {
                console.log(response);
              }
            });
          };

        };

        idButton.onclick = function () {
          let a_tuple_list = getTuplesByValue(tuples, 'id', idInput.value);
          list.innerHTML = '';
          addTable(list, a_tuple_list, 'department', false);
        };

        nameButton.onclick = function () {
          let a_tuple_list = getTuplesByValue(tuples, 'name', nameInput.value);
          list.innerHTML = '';
          addTable(list, a_tuple_list, 'department', false);
        };
      });
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

        $.get(backendhost + "/api/log", function (data) {

          let tuples = data['getRes'];
          console.log(tuples);
          addLogInfo(list, tuples);

          listHeading.innerHTML = "日志管理 <br /><br />" +
            "<button id='allButton'>显示全部</button><br />" +
            "按日志号查询: <input type='number' id='idInput' /><button id='idButton'>确认</button><br />" +
            "按员工号查询: <input type='number' id='employeeIdInput' /><button id='employeeIdButton'>确认</button><br />";


          let allButton = document.getElementById('allButton');
          let idInput = document.getElementById('idInput');
          let idButton = document.getElementById('idButton');
          let employeeIdInput = document.getElementById('employeeIdInput');
          let employeeIdButton = document.getElementById('employeeIdButton');
          //let modifyInput = document.getElementById('modifyInput');
          //let modifyButton = document.getElementById('modifyButton');


          allButton.onclick = function () {
            list.innerHTML = "";
            addLogInfo(list, tuples);
          };
          idButton.onclick = function () {
            let a_tuple_list = getTuplesByValue(tuples, 'id', idInput.value);
            list.innerHTML = '';
            addLogInfo(list, a_tuple_list);
          };

          employeeIdButton.onclick = function () {
            let a_tuple_list = getTuplesByValue(tuples, 'employee_id', employeeIdInput.value);
            list.innerHTML = '';
            addLogInfo(list, a_tuple_list);
          };
          /*
          modifyButton.onclick = function () {
              let a_tuple_list = getTuplesByValue(tuples, 'operate_type', modifyInput.value);
              console.log(a_tuple_list);
              list.innerHTML = '';
              addLogInfo(list, a_tuple_list);
          };
          */


          let current_tuples = tuples;
          let sort_attributes = ['id', 'employee_id'];

          let sortButtons = [];
          let sortButton_prompts = ['日志号排序', '员工号排序'];
          let div1 = document.createElement("div");
          for (let i = 0; i < sortButton_prompts.length; i++) {
            let button = document.createElement("button");
            button.innerHTML = sortButton_prompts[i];
            let reverse = false;
            button.onclick = function () {
              if (i < sortButton_prompts.length) {
                current_tuples = getSortedTuplesByAttribute(tuples, sort_attributes[i], reverse);
                addLogInfo(list, current_tuples);
              }
              reverse = !reverse;
            };
            div1.appendChild(button);
            sortButtons.push(button);
          }
          listHeading.append(div1);
        });
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
      let tuples;
      if (userInfo['adminRight'] == true) {
        tuples = data['getRes']['employeeChecks'];
      }
      else {
        tuples = data['getRes'];
      }
      let personal_tuples = [];

      for (let row of tuples) {
        if (row['employee_id'] == userInfo['id']) {
          personal_tuples.push(row);
        }
      }
      addTable(list, personal_tuples, type = 'check', editable = true);

      listHeading.innerHTML = "个人考勤信息 <br /><br />" +
        "<button id='allButton'>显示全部</button><br />" +
        "按指定日期查询: <input type='date' id='dateInput' /><button id='dateButton'>确认</button><br />" +
        "按指定时间段查询: <input type='date' id='beginDateInput' />-<input type='date' id='endDateInput' /><button id='beginEndDateButton'>确认</button><br />";

      let allButton = document.getElementById('allButton');
      let dateInput = document.getElementById('dateInput');
      let dateButton = document.getElementById('dateButton');

      let beginDateInput = document.getElementById('beginDateInput');
      let endDateInput = document.getElementById('endDateInput');
      let beginEndDateButton = document.getElementById('beginEndDateButton');

      allButton.onclick = function () {
        list.innerHTML = "";
        addTable(list, personal_tuples, type = 'check', editable = true);
      };
      dateButton.onclick = function () {
        let a_tuple_list = getTuplesByValue(personal_tuples, 'check_date', dateInput.value);
        list.innerHTML = '';
        addTable(list, a_tuple_list, 'check', false);
      };
      beginEndDateButton.onclick = function () {
        let a_tuple_list = getTuplesByValueInterval(personal_tuples, 'check_date', beginDateInput.value, endDateInput.value);
        list.innerHTML = '';
        addTable(list, a_tuple_list, 'check', false);
      };
    });
    });
  if (userInfo['headRight'] || userInfo['personnelRight'] || userInfo['adminRight']) {
    addList(list, "", "员工考勤信息查询", "", function () {
      //todo
      //listHeading.innerHTML = "员工考勤信息";
      list.innerHTML = '';

      $.get(backendhost + "/api/check", function (data) {

        let tuples;
        if (userInfo['adminRight'] == true) {
          tuples = data['getRes']['employeeChecks'];
        }
        else {
          tuples = data['getRes'];
        }
        console.log(data);
        addTable(list, tuples, type = 'check', editable = true);

        listHeading.innerHTML = "员工考勤信息 <br /><br />" +
          "<button id='addButton'>新增</button><br />" +
          "<button id='allButton'>显示全部</button><br />" +
          "按员工号查询: <input type='number' id='idInput' /><button id='idButton'>确认</button><br />" +
          "按员工姓名查询: <input type='text' id='nameInput' /><button id='nameButton'>确认</button><br />" +
          "按部门号查询: <input type='number' id='departmentInput' /><button id='departmentButton'>确认</button><br />" +
          "按指定日期查询: <input type='date' id='dateInput' /><button id='dateButton'>确认</button><br />" +
          "按指定时间段查询: <input type='date' id='beginDateInput' />-<input type='date' id='endDateInput' /><button id='beginEndDateButton'>确认</button><br />";

        let addButton = document.getElementById('addButton');
        let allButton = document.getElementById('allButton');

        let idInput = document.getElementById('idInput');
        let idButton = document.getElementById('idButton');
        let nameInput = document.getElementById('nameInput');
        let nameButton = document.getElementById('nameButton');
        let departmentInput = document.getElementById('departmentInput');
        let departmentButton = document.getElementById('departmentButton');
        let dateInput = document.getElementById('dateInput');
        let dateButton = document.getElementById('dateButton');

        let beginDateInput = document.getElementById('beginDateInput');
        let endDateInput = document.getElementById('endDateInput');
        let beginEndDateButton = document.getElementById('beginEndDateButton');

        addButton.onclick = function () {
          listHeading.innerHTML = "新增员工考勤信息";
          list.innerHTML = '';
          let employeeIdInput = addInput(list, 'employee_id', 'number', '');
          let checkDateInput = addInput(list, 'check_date', 'date', '');
          let checkInTime = addInput(list, 'check_in_time', 'time', '');
          let checkOutTime = addInput(list, 'check_out_time', 'time', '');
          let checkInStatus = addInput(list, 'check_in_status', 'number', '');
          let checkOutStatus = addInput(list, 'check_out_status', 'number', '');


          let buttons = addButtons(list, ['submit', 'reset']);
          buttons[0].onclick = function () {
            let tmpObj = {
              'employee_id': Number(employeeIdInput.value),
              'check_date': checkDateInput.value,
              'check_in_time': checkInTime.value,
              'check_out_time': checkOutTime.value,
              'check_in_status': Number(checkInStatus.value),
              'check_out_status': Number(checkOutStatus.value)
            };
            console.log(tmpObj);
            $.post(backendhost + "/api/employee", tmpObj, function (data) {
              if (data) {
                console.log(data);
              }
              else {
                alert("No such");
              }
            });
          };
          buttons[1].onclick = function () {
            employeeIdInput.value = '';
            checkDateInput.value = '';
            checkInTime.value = '';
            checkOutTime.value = '';
            checkInStatus.value = '';
            checkOutStatus.value = '';
          };
        };

        allButton.onclick = function () {
          list.innerHTML = "";
          addTable(list, tuples, type = 'check', editable = true);
        };

        idButton.onclick = function () {
          let a_tuple_list = getTuplesByValue(tuples, 'employee_id', idInput.value);
          list.innerHTML = '';
          addTable(list, a_tuple_list, 'check', false);
        };

        nameButton.onclick = function () {
          $.get(backendhost + "/api/check/employee_name/" + nameInput.value, function (data) {
            if (data) {
              console.log(data);
              list.innerHTML = '';
              addTable(list, data['getRes'], 'check', false);
            }
            else {
              alert("No such");
            }
          });
        };

        departmentButton.onclick = function () {
          $.get(backendhost + "/api/check/department_id/" + departmentInput.value, function (data) {
            if (data) {
              console.log(data);
              list.innerHTML = '';
              addTable(list, data['getRes'], 'check', false);
            }
            else {
              alert("No such");
            }
          });
        };
        dateButton.onclick = function () {
          let a_tuple_list = getTuplesByValue(tuples, 'check_date', dateInput.value);
          list.innerHTML = '';
          addTable(list, a_tuple_list, 'check', false);
        };
        beginEndDateButton.onclick = function () {
          let a_tuple_list = getTuplesByValueInterval(tuples, 'check_date', beginDateInput.value, endDateInput.value);
          list.innerHTML = '';
          addTable(list, a_tuple_list, 'check', false);
        };
        /*
         headButton.onclick = function () {
         let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
         list.innerHTML = '';

         console.log(a_tuple_list[0]);
         $.post(backendhost + "/api/relation/assign/head", {
         employee_id: idInput.value,
         department_id: a_tuple_list[0]['department_id']
         }, function (data) {
         if (data) {
         console.log(data);
         a_tuple_list[0]['right'] = 'head';
         addTable(list, a_tuple_list, false, 'employee');
         addTable(list, department_tuples, false, 'department');
         }
         else {
         alert("No such");
         }
         });
         };
         personnelButton.onclick = function () {
         let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
         list.innerHTML = '';

         console.log(a_tuple_list[0]);
         $.post(backendhost + "/api/relation/assign/personnel", {
         employee_id: idInput.value,
         department_id: a_tuple_list[0]['department_id']
         }, function (data) {
         if (data) {
         console.log(data);
         a_tuple_list[0]['right'] = 'personnel';
         addTable(list, a_tuple_list, false, 'employee');
         addTable(list, department_tuples, false, 'department');
         }
         else {
         alert("No such");
         }
         });
         };
         adminButton.onclick = function () {
         let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
         list.innerHTML = '';

         console.log(a_tuple_list[0]);
         $.post(backendhost + "/api/relation/assign/administrator", {
         employee_id: idInput.value,
         department_id: a_tuple_list[0]['department_id']
         }, function (data) {
         if (data) {
         console.log(data);
         a_tuple_list[0]['right'] = 'admin';
         addTable(list, a_tuple_list, false, 'employee');
         addTable(list, department_tuples, false, 'department');
         }
         else {
         alert("No such");
         }
         });
         };
         dismissButton.onclick = function() {
         let a_tuple_list = getTuplesByValue(employee_tuples, 'check_date', idInput.value);
         list.innerHTML = '';


         $.post(backendhost + "/api/relation/dismiss", {
         employee_id: idInput.value,
         }, function (data) {
         if (data) {
         console.log(data);
         a_tuple_list[0]['department_id'] = "无";
         a_tuple_list[0]['department_name'] = "无";
         a_tuple_list[0]['department_code'] = "无";
         addTable(list, a_tuple_list, false, 'employee');
         addTable(list, department_tuples, false, 'department');
         }
         else {
         alert("No such");
         }
         });
         };
         */
      });
    });
  }
};

let leaveQuery = document.getElementById("leaveQuery");
leaveQuery.onclick = function () {
    listHeading.innerHTML = "请假查询";
    list.innerHTML = '';
  addList(list, "", "个人请假信息查询", "", function () {
    //todo

    list.innerHTML = '';

    $.get(backendhost + "/api/leave", function (data) {
      let tuples;
      if (userInfo['adminRight'] == true) {
        tuples = data['getRes']['employeeLeaves'];
      }
      else {
        tuples = data['getRes'];
      }
      let personal_tuples = [];
      for (let row of tuples) {
        if (row['employee_id'] == userInfo['id']) {
          personal_tuples.push(row);
        }
      }
      addLeaveInfo(list, personal_tuples, 'asker_all');
      listHeading.innerHTML = "个人请假信息 <br /><br />" +
        "<button id='allButton'>显示全部</button><br />" +
        "按指定日期查询: <input type='date' id='dateInput' /><button id='dateButton'>确认</button><br />" +
        "按指定时间段查询: <input type='date' id='beginDateInput' />-<input type='date' id='endDateInput' /><button id='beginEndDateButton'>确认</button><br />";

      let allButton = document.getElementById('allButton');

      let dateInput = document.getElementById('dateInput');
      let dateButton = document.getElementById('dateButton');

      let beginDateInput = document.getElementById('beginDateInput');
      let endDateInput = document.getElementById('endDateInput');
      let beginEndDateButton = document.getElementById('beginEndDateButton');

      let current_tuples = personal_tuples;

      allButton.onclick = function () {
        list.innerHTML = "";
        current_tuples = addLeaveInfo(list, personal_tuples, 'asker_all');
      };

      dateButton.onclick = function () {
        let a_tuple_list = getTuplesBetweenTwoAttributesByValue(tuples, 'begin_date', 'end_date', dateInput.value);
        list.innerHTML = '';
        current_tuples = addLeaveInfo(list, a_tuple_list, 'asker_all');
      };
      beginEndDateButton.onclick = function () {
        let a_tuple_list = getTuplesBetweenTwoAttributesByValueInterval(tuples, 'begin_date', 'end_date', beginDateInput.value, endDateInput.value);
        list.innerHTML = '';
        current_tuples = addLeaveInfo(list, a_tuple_list, 'asker_all');
      };

      let buttons = [];
      let button_prompts = ['待处理', '接受', '拒绝', '未提交'];
      for (let i = 0; i < button_prompts.length; i++) {
        let button = document.createElement("button");
        button.innerHTML = button_prompts[i];
        listHeading.appendChild(button);
        buttons.push(button);
      }
      /*
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
       */
      let button_states = ['asker_process', 'asker_approve', 'asker_reject', 'asker_save'];
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
          list.innerHTML = '';
          addLeaveInfo(list, current_tuples, button_states[i]);
        }
      }
    });

  });
  if (userInfo['headRight'] || userInfo['personnelRight'] || userInfo['adminRight']) {
    addList(list, "", "员工请假信息查询", "", function () {
      //todo


      list.innerHTML = '';

      $.get(backendhost + "/api/leave", function (data) {
        let tuples;
        if (userInfo['adminRight'] == true) {
          tuples = data['getRes']['employeeLeaves'];
        }
        else {
          tuples = data['getRes'];
        }
        let personal_tuples = tuples;

        addLeaveInfo(list, personal_tuples, 'manager_all');

        listHeading.innerHTML = "员工请假信息 <br /><br />" +
          "<button id='allButton'>显示全部</button><br />" +
          "按员工号查询: <input type='number' id='idInput' /><button id='idButton'>确认</button><br />" +
          "按员工姓名查询: <input type='text' id='nameInput' /><button id='nameButton'>确认</button><br />" +
          "按部门号查询: <input type='number' id='departmentInput' /><button id='departmentButton'>确认</button><br />" +
          "按部门名称查询: <input type='text' id='departmentNameInput' /><button id='departmentNameButton'>确认</button><br />" +
          "按指定日期查询: <input type='date' id='dateInput' /><button id='dateButton'>确认</button><br />" +
          "按指定时间段查询: <input type='date' id='beginDateInput' />-<input type='date' id='endDateInput' /><button id='beginEndDateButton'>确认</button><br />";

        let allButton = document.getElementById('allButton');
        let idInput = document.getElementById('idInput');
        let idButton = document.getElementById('idButton');
        let nameInput = document.getElementById('nameInput');
        let nameButton = document.getElementById('nameButton');
        let departmentInput = document.getElementById('departmentInput');
        let departmentButton = document.getElementById('departmentButton');
        let departmentNameInput = document.getElementById('departmentNameInput');
        let departmentNameButton = document.getElementById('departmentNameButton');
        let dateInput = document.getElementById('dateInput');
        let dateButton = document.getElementById('dateButton');

        let beginDateInput = document.getElementById('beginDateInput');
        let endDateInput = document.getElementById('endDateInput');
        let beginEndDateButton = document.getElementById('beginEndDateButton');

        let current_tuples = personal_tuples;

        allButton.onclick = function () {
          list.innerHTML = "";
          current_tuples = addLeaveInfo(list, personal_tuples, 'manager_all');
        };
        idButton.onclick = function () {
          let a_tuple_list = getTuplesByValue(tuples, 'employee_id', idInput.value);
          list.innerHTML = '';
          current_tuples = addLeaveInfo(list, a_tuple_list, 'manager_all');
        };

        nameButton.onclick = function () {
          let a_tuple_list = getTuplesByAttributeAccordingEmployee(tuples, 'name', nameInput.value);
          list.innerHTML = '';
          current_tuples = addLeaveInfo(list, a_tuple_list, 'manager_all');
        };

        departmentButton.onclick = function () {
          let a_tuple_list = getTuplesByAttributeAccordingEmployee(tuples, 'department_id', departmentInput.value);
          list.innerHTML = '';
          current_tuples = addLeaveInfo(list, a_tuple_list, 'manager_all');
        };

        departmentNameButton.onclick = function () {
          let a_tuple_list = getTuplesByAttributeAccordingEmployee(tuples, 'department_name', departmentInput.value);
          list.innerHTML = '';
          current_tuples = addLeaveInfo(list, a_tuple_list, 'manager_all');
        };
        dateButton.onclick = function () {
          let a_tuple_list = getTuplesBetweenTwoAttributesByValue(tuples, 'begin_date', 'end_date', dateInput.value);
          list.innerHTML = '';
          current_tuples = addLeaveInfo(list, a_tuple_list, 'manager_all');
        };
        beginEndDateButton.onclick = function () {
          let a_tuple_list = getTuplesBetweenTwoAttributesByValueInterval(tuples, 'begin_date', 'end_date', beginDateInput.value, endDateInput.value);
          list.innerHTML = '';
          current_tuples = addLeaveInfo(list, a_tuple_list, 'manager_all');
        };

        let sort_attributes = ['id', 'employee_id', 'begin_date', 'end_date'];

        let sortButtons = [];
        let sortButton_prompts = ['考勤号排序', '员工号排序', '开始时间排序', '结束时间排序', '请假天数排序'];
        let div1 = document.createElement("div");
        for (let i = 0; i < sortButton_prompts.length; i++) {
          let button = document.createElement("button");
          button.innerHTML = sortButton_prompts[i];
          let reverse = false;
          button.onclick = function () {
            if (i < sortButton_prompts.length - 1) {
              current_tuples = getSortedTuplesByAttribute(tuples, sort_attributes[i], reverse);
              addLeaveInfo(list, current_tuples, 'manager_all');
            } else {
              current_tuples = getSortedTuplesByDateDifference(tuples, 'begin_date', 'end_date', reverse);
              addLeaveInfo(list, current_tuples, 'manager_all');
            }
            reverse = !reverse;
          };
          div1.appendChild(button);
          sortButtons.push(button);
        }
        listHeading.append(div1);

        let buttons = [];
        let button_prompts = ['待处理', '接受', '拒绝'];
        let div2 = document.createElement("div");
        for (let i = 0; i < button_prompts.length; i++) {
          let button = document.createElement("button");
          button.innerHTML = button_prompts[i];
          listHeading.appendChild(button);
          buttons.push(button);
        }
        listHeading.append(div2);


        /*
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
         */
        let button_states = ['manager_process', 'manager_approve', 'manager_reject'];
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].onclick = function () {
            list.innerHTML = '';
            addLeaveInfo(list, current_tuples, button_states[i]);
          }
        }
      });
    });
  }
};

let tripQuery = document.getElementById("tripQuery");
tripQuery.onclick = function () {
    listHeading.innerHTML = "出差查询";
    list.innerHTML = '';
  addList(list, "", "个人出差信息查询", "", function () {
        //todo

    list.innerHTML = '';

    $.get(backendhost + "/api/trip", function (data) {
      let tuples;
      if (userInfo['adminRight'] == true) {
        tuples = data['getRes']['employeeTrips'];
      }
      else {
        tuples = data['getRes'];
      }
      let personal_tuples = [];
      for (let row of tuples) {
        if (row['employee_id'] == userInfo['id']) {
          personal_tuples.push(row);
        }
      }
      addTripInfo(list, personal_tuples, 'asker_all');
      listHeading.innerHTML = "个人出差信息 <br /><br />" +
        "<button id='allButton'>显示全部</button><br />" +
        "按指定日期查询: <input type='date' id='dateInput' /><button id='dateButton'>确认</button><br />" +
        "按指定时间段查询: <input type='date' id='beginDateInput' />-<input type='date' id='endDateInput' /><button id='beginEndDateButton'>确认</button><br />";

      let allButton = document.getElementById('allButton');

      let dateInput = document.getElementById('dateInput');
      let dateButton = document.getElementById('dateButton');

      let beginDateInput = document.getElementById('beginDateInput');
      let endDateInput = document.getElementById('endDateInput');
      let beginEndDateButton = document.getElementById('beginEndDateButton');

      let current_tuples = personal_tuples;

      allButton.onclick = function () {
        list.innerHTML = "";
        current_tuples = addTripInfo(list, personal_tuples, 'asker_all');
      };

      dateButton.onclick = function () {
        let a_tuple_list = getTuplesBetweenTwoAttributesByValue(tuples, 'begin_date', 'end_date', dateInput.value);
        list.innerHTML = '';
        current_tuples = addTripInfo(list, a_tuple_list, 'asker_all');
      };
      beginEndDateButton.onclick = function () {
        let a_tuple_list = getTuplesBetweenTwoAttributesByValueInterval(tuples, 'begin_date', 'end_date', beginDateInput.value, endDateInput.value);
        list.innerHTML = '';
        current_tuples = addTripInfo(list, a_tuple_list, 'asker_all');
      };

      let buttons = [];
      let button_prompts = ['待处理', '接受', '拒绝', '未提交'];
      for (let i = 0; i < button_prompts.length; i++) {
        let button = document.createElement("button");
        button.innerHTML = button_prompts[i];
        listHeading.appendChild(button);
        buttons.push(button);
      }
      /*
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
       */
      let button_states = ['asker_process', 'asker_approve', 'asker_reject', 'asker_save'];
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
          list.innerHTML = '';
          addTripInfo(list, current_tuples, button_states[i]);
        }
      }
    });

    });
  if (userInfo['headRight'] || userInfo['personnelRight'] || userInfo['adminRight']) {
    addList(list, "", "员工出差信息查询", "", function () {
      //todo


      list.innerHTML = '';

      $.get(backendhost + "/api/trip", function (data) {
        let tuples;
        if (userInfo['adminRight'] == true) {
          tuples = data['getRes']['employeeTrips'];
        }
        else {
          tuples = data['getRes'];
        }
        let personal_tuples = tuples;

        addTripInfo(list, personal_tuples, 'manager_all');

        listHeading.innerHTML = "员工出差信息 <br /><br />" +
          "<button id='allButton'>显示全部</button><br />" +
          "按员工号查询: <input type='number' id='idInput' /><button id='idButton'>确认</button><br />" +
          "按员工姓名查询: <input type='text' id='nameInput' /><button id='nameButton'>确认</button><br />" +
          "按部门号查询: <input type='number' id='departmentInput' /><button id='departmentButton'>确认</button><br />" +
          "按部门名称查询: <input type='text' id='departmentNameInput' /><button id='departmentNameButton'>确认</button><br />" +
          "按指定日期查询: <input type='date' id='dateInput' /><button id='dateButton'>确认</button><br />" +
          "按指定时间段查询: <input type='date' id='beginDateInput' />-<input type='date' id='endDateInput' /><button id='beginEndDateButton'>确认</button><br />";

        let allButton = document.getElementById('allButton');
        let idInput = document.getElementById('idInput');
        let idButton = document.getElementById('idButton');
        let nameInput = document.getElementById('nameInput');
        let nameButton = document.getElementById('nameButton');
        let departmentInput = document.getElementById('departmentInput');
        let departmentButton = document.getElementById('departmentButton');
        let departmentNameInput = document.getElementById('departmentNameInput');
        let departmentNameButton = document.getElementById('departmentNameButton');
        let dateInput = document.getElementById('dateInput');
        let dateButton = document.getElementById('dateButton');

        let beginDateInput = document.getElementById('beginDateInput');
        let endDateInput = document.getElementById('endDateInput');
        let beginEndDateButton = document.getElementById('beginEndDateButton');

        let current_tuples = personal_tuples;

        allButton.onclick = function () {
          list.innerHTML = "";
          current_tuples = addTripInfo(list, personal_tuples, 'manager_all');
        };
        idButton.onclick = function () {
          let a_tuple_list = getTuplesByValue(tuples, 'employee_id', idInput.value);
          list.innerHTML = '';
          current_tuples = addTripInfo(list, a_tuple_list, 'manager_all');
        };

        nameButton.onclick = function () {
          let a_tuple_list = getTuplesByAttributeAccordingEmployee(tuples, 'name', nameInput.value);
          list.innerHTML = '';
          current_tuples = addTripInfo(list, a_tuple_list, 'manager_all');
        };

        departmentButton.onclick = function () {
          let a_tuple_list = getTuplesByAttributeAccordingEmployee(tuples, 'department_id', departmentInput.value);
          list.innerHTML = '';
          current_tuples = addTripInfo(list, a_tuple_list, 'manager_all');
        };

        departmentNameButton.onclick = function () {
          let a_tuple_list = getTuplesByAttributeAccordingEmployee(tuples, 'department_name', departmentInput.value);
          list.innerHTML = '';
          current_tuples = addTripInfo(list, a_tuple_list, 'manager_all');
        };
        dateButton.onclick = function () {
          let a_tuple_list = getTuplesBetweenTwoAttributesByValue(tuples, 'begin_date', 'end_date', dateInput.value);
          list.innerHTML = '';
          current_tuples = addTripInfo(list, a_tuple_list, 'manager_all');
        };
        beginEndDateButton.onclick = function () {
          let a_tuple_list = getTuplesBetweenTwoAttributesByValueInterval(tuples, 'begin_date', 'end_date', beginDateInput.value, endDateInput.value);
          list.innerHTML = '';
          current_tuples = addTripInfo(list, a_tuple_list, 'manager_all');
        };

        let sort_attributes = ['id', 'employee_id', 'begin_date', 'end_date'];

        let sortButtons = [];
        let sortButton_prompts = ['出差号排序', '员工号排序', '开始时间排序', '结束时间排序', '请假天数排序'];
        let div1 = document.createElement("div");
        for (let i = 0; i < sortButton_prompts.length; i++) {
          let button = document.createElement("button");
          button.innerHTML = sortButton_prompts[i];
          let reverse = false;
          button.onclick = function () {
            if (i < sortButton_prompts.length - 1) {
              current_tuples = getSortedTuplesByAttribute(tuples, sort_attributes[i], reverse);
              addTripInfo(list, current_tuples, 'manager_all');
            } else {
              current_tuples = getSortedTuplesByDateDifference(tuples, 'begin_date', 'end_date', reverse);
              addTripInfo(list, current_tuples, 'manager_all');
            }
            reverse = !reverse;
          };
          div1.appendChild(button);
          sortButtons.push(button);
        }
        listHeading.append(div1);

        let buttons = [];
        let button_prompts = ['待处理', '接受', '拒绝'];
        let div2 = document.createElement("div");
        for (let i = 0; i < button_prompts.length; i++) {
          let button = document.createElement("button");
          button.innerHTML = button_prompts[i];
          listHeading.appendChild(button);
          buttons.push(button);
        }
        listHeading.append(div2);


        /*
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
         */
        let button_states = ['manager_process', 'manager_approve', 'manager_reject'];
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].onclick = function () {
            list.innerHTML = '';
            addTripInfo(list, current_tuples, button_states[i]);
          }
        }
      });
    });
  }
};

let singleSetting = document.getElementById("singleSetting");
singleSetting.onclick = function () {
  listHeading.innerHTML = "个人设置";
  list.innerHTML = '';
  addList(list, "", "修改密码", "", function () {
    list.innerHTML = "";
        //todo
    let oldP = addInput(list, '旧密码', 'password', '');
    let newP = addInput(list, '新密码', 'password', '');
    let reP = addInput(list, '新密码确认', 'password', '');
    let buttons = addButtons(list, ['Submit', 'Reset']);
    buttons[0].onclick = function () {
      //todo 修改密码

      if (newP.value != reP.value) {
        alert("两次密码输入不一致");
      }
      else if (md5(oldP.value) != userInfo['password']) {
        alert("旧密码错误");
        console.log(userInfo);
      }
      else {
        let tempData = {id: userInfo['id'], name: userInfo['name'], password: md5(newP.value)};
        console.log(userInfo);
        $.ajax({
          url: backendhost + '/api/employee/' + userInfo['id'],
          type: 'PUT',
          data: tempData,
          success: function (response) {
            console.log(response);

          }
        });
      }


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
      /*
       addList(list, "", "上班放假时间设定", "", function () {
       //todo
       });
       */
      addList(list, "", "员工权限设定", "", function () {
            //todo

        $.get(backendhost + "/api/department", function (data) {
          let department_tuples = data['getRes'];
          console.log(data);

          $.get(backendhost + "/api/employee", function (data) {
            let employee_tuples = getKeyInfoByEmployeeTuples(data['getRes']);
            console.log(data);

            list.innerHTML = '';
            console.log(employee_tuples);
            addTable(list, employee_tuples, type = 'employee', editable = false);
            addTable(list, department_tuples, type = 'department', editable = false);


            listHeading.innerHTML = "员工权限设定 <br /><br />" +
              "id:<input type='number' id='idInput' /><button id='searchButton'>search</button><br />" +
              "安排部门<input type='number' id='departmentInput' /><button id='departmentButton'>确认</button><br />" +
              "任命为部门主管<button id='headButton'>确认</button><br />" +
              "任命为人事管理员(仅admin权限)<button id='personnelButton'>确认</button><br />" +
              "任命为系统管理员(仅admin权限)<button id='adminButton'>确认</button><br />" +
              "踢出部门<button id='dismissButton'>确认</button>";

            let idInput = document.getElementById('idInput');
            let searchButton = document.getElementById('searchButton');
            let departmentInput = document.getElementById('departmentInput');
            let departmentButton = document.getElementById('departmentButton');
            let headButton = document.getElementById('headButton');
            let personnelButton = document.getElementById('personnelButton');
            let adminButton = document.getElementById('adminButton');
            let dismissButton = document.getElementById('dismissButton');

            searchButton.onclick = function () {
              let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
              list.innerHTML = '';
              addTable(list, a_tuple_list, 'employee', false);
              addTable(list, department_tuples, 'department', false);
            };
            departmentButton.onclick = function () {
              let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
              list.innerHTML = '';


              $.post(backendhost + "/api/relation/assign/belong", {
                employee_id: idInput.value,
                department_id: departmentInput.value
              }, function (data) {
                if (data) {
                  console.log(data);
                  a_tuple_list[0]['department_id'] = department_tuples[departmentInput.value - 1]['id'];
                  a_tuple_list[0]['department_name'] = department_tuples[departmentInput.value - 1]['name'];
                  a_tuple_list[0]['department_code'] = department_tuples[departmentInput.value - 1]['code'];
                  addTable(list, a_tuple_list, 'employee', false);
                  addTable(list, department_tuples, 'department', false);
                }
                else {
                  alert("No such");
                }
              });
            };
            headButton.onclick = function () {
              let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
              list.innerHTML = '';

              console.log(a_tuple_list[0]);
              $.post(backendhost + "/api/relation/assign/head", {
                employee_id: idInput.value,
                department_id: a_tuple_list[0]['department_id']
              }, function (data) {
                if (data) {
                  console.log(data);
                  a_tuple_list[0]['right'] = 'head';
                  addTable(list, a_tuple_list, 'employee', false);
                  addTable(list, department_tuples, 'department', false);
                }
                else {
                  alert("No such");
                }
              });
            };
            personnelButton.onclick = function () {
              let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
              list.innerHTML = '';

              console.log(a_tuple_list[0]);
              $.post(backendhost + "/api/relation/assign/personnel", {
                employee_id: idInput.value,
                department_id: a_tuple_list[0]['department_id']
              }, function (data) {
                if (data) {
                  console.log(data);
                  a_tuple_list[0]['right'] = 'personnel';
                  addTable(list, a_tuple_list, 'employee', false);
                  addTable(list, department_tuples, 'department', false);
                }
                else {
                  alert("No such");
                }
              });
            };
            adminButton.onclick = function () {
              let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
              list.innerHTML = '';

              console.log(a_tuple_list[0]);
              $.post(backendhost + "/api/relation/assign/administrator", {
                employee_id: idInput.value,
                department_id: a_tuple_list[0]['department_id']
              }, function (data) {
                if (data) {
                  console.log(data);
                  a_tuple_list[0]['right'] = 'admin';
                  addTable(list, a_tuple_list, 'employee', false);
                  addTable(list, department_tuples, 'department', false);
                }
                else {
                  alert("No such");
                }
              });
            };
            dismissButton.onclick = function () {
              let a_tuple_list = getTuplesByValue(employee_tuples, 'id', idInput.value);
              list.innerHTML = '';


              $.post(backendhost + "/api/relation/dismiss", {
                employee_id: idInput.value,
              }, function (data) {
                if (data) {
                  console.log(data);
                  a_tuple_list[0]['department_id'] = "无";
                  a_tuple_list[0]['department_name'] = "无";
                  a_tuple_list[0]['department_code'] = "无";
                  addTable(list, a_tuple_list, 'employee', false);
                  addTable(list, department_tuples, 'department', false);
                }
                else {
                  alert("No such");
                }
              });
            };
          });
        });
        });
    }
};

