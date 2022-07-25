/**
 * @author: Bharat Kalyan Ram
 * @description: All the functions required for To-Do List UI
 */

activeTasks = [];
cmpltTasks = [];

/**
 * Used to display active and copleted tasks
 * @param {*} type active/completed
 */
function getTasksByType(type) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // console.log(this.responseText);
      var tasks = JSON.parse(this.responseText);
      tasks.forEach(task => {
        task.is_completed = task.is_completed.data[0];
        task.is_deleted = task.is_deleted.data[0];
      });
      let str = '';
      if (type == "active") {
        activeTasks = tasks;
        for (var i = 0; i < activeTasks.length; i++) {
          str += `<div class="tasks">
          <input type="checkbox" name="checkbox" value=${i}
            onchange="statusUpdate(event,'active')">
            ${activeTasks[i].title}
            <span style="float:right;"><button name="delete" type="button" value=${i} class="btn btn-danger mb- " onclick="deleteTask(event,'active')">Delete</button></div>
        </span>
        <hr>`
        }
        document.getElementById("active").innerHTML = str;
      }
      else {
        cmpltTasks = tasks;
        for (var i = 0; i < cmpltTasks.length; i++) {
          str += `<div class="tasks">
          <input type="checkbox" name="checkbox" checked value=${i}
            onchange="statusUpdate(event,'completed')">
            ${cmpltTasks[i].title}
            <span style="float:right;"><button type="button" class="btn btn-danger ms-4 mb-auto" value=${i}  onclick="deleteTask(event,'completed')">Delete</button></span>
        </div>
        <hr>`
        }
        document.getElementById("cmplt").innerHTML = str;
      }

    }
  };
  xhttp.open("GET", "http://localhost:3000/tasks?type=" + type, true);
  xhttp.send();
}

/**
 * Used for updating a task.
 * Common for all actions (complete/incomplete or delete)
 * @param {*} task object with all attributes
 */
function updateTask(task) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    // check error and show respective msg
    // refresh page
    location.reload();
  };
  xhttp.open("PUT", "http://localhost:3000/task", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  // console.log(task);
  xhttp.send(task);
}

/**
 * Used to update task i.e. Active/Completed
 * @param {*} event 
 * @param {*} txt 
 */
function statusUpdate(event, txt) {
  var task = txt == "active" ? activeTasks[event.target.value] : cmpltTasks[event.target.value];
  task.is_completed = (task.is_completed ? 0 : 1);
  if (!task.is_completed) {
    task.completed_at = null;
  }
  // call update api 
  updateTask(JSON.stringify(task));
}

/**
 * Used to delete a task (active or completed)
 * @param {*} event 
 * @param {*} txt 
 */
function deleteTask(event, txt) {
  var task = txt == "active" ? activeTasks[event.target.value] : cmpltTasks[event.target.value];
  console.log(event);
  task.is_deleted = 1;
  // call update api 

  updateTask(JSON.stringify(task));
}

/**
 * Used to add new task
 */
function createTask() {
  console.log(document.getElementById("taskTitle").value);
  var title = document.getElementById("taskTitle").value;
  var xhttp = new XMLHttpRequest();
  // const body = {"title": title};
  xhttp.onreadystatechange = function () {
    // check error and show respective msg
    // refresh page
    location.reload();
  };
  xhttp.open("POST", "http://localhost:3000/task", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  // console.log(task);
  xhttp.send(JSON.stringify({ title }));
}

// Initail calls to fill page
getTasksByType("active");
getTasksByType("completed");


// Set Enter kety to add a new task
document.addEventListener('keydown', function (event) {
 
  if (event.key === 'Enter') {
    event.preventDefault();
    createTask();
  }
});