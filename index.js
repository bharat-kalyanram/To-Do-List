//require the express app
var express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todolist"
});

var app = express();
// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.set('view engine', 'ejs');

app.get('/tasks', function (req, res) {
  console.log('GET request received at /tasks');
  var sql = "select * from task where is_deleted = 0 ";
  var type = req.query.type;
  if (type) {
    if (type == 'active') sql = sql + 'and is_completed = 0';
    else sql = sql + 'and is_completed = 1';
  }
  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
      res.send(result);
    }
  });
});


app.post('/task', function (req, res) {
  console.log('POST request received at /task');
  var title = req.body.title;
  if (title) {
    var sql = `insert into task (title) values ("${title}")`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        res.send(result);
      }
    });
  }
  else res.end();
});

app.put('/task', function (req, res) {
  console.log('PUT request received at /task');
  var title = req.body.title;
  var id = req.body.id;
  var del = req.body.is_deleted;
  var comp = req.body.is_completed;
  if (comp == 0) {
    var sql = `update task set is_completed = ${comp}, completed_at = null, is_deleted = ${del}, title = "${title}" where id = ${id}`;
  }
  else { var sql = `update task set is_completed = ${comp}, is_deleted = ${del}, completed_at = CURRENT_TIMESTAMP, title = "${title}" where id = ${id}`; }

  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
      res.send(result);
    }
  });
});




//the server is listening on port 3000 for connections
app.listen(3000, function () {
  console.log('To-Do List App listening on port 3000!')
});