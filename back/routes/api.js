var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'chronacc'
});

router.get('/', function(req, res, next) {
  res.send('api');
});

router.get('/tasks/:begin*?/:end*?', function(req, res, next) {
  connection.query('SELECT * FROM `tasks` WHERE `user_id` = 1 ORDER BY `id` DESC LIMIT 0, 10', 
    function(err, rows, fields) {
      if (err) throw err;
      console.log('The solution is: ', rows);
      res.send('api', rows);
    });
});

router.post('/task', function(req, res, next) {
  var reqData = JSON.parse(req.body.data);
  var task = {};

  task.time = reqData.task.time;
  task.desc = reqData.task.name || '';
  task.time_str = '';
  task.project_id = reqData.task.project ? reqData.task.project.id : 1;

  var dateObj = new Date(reqData.periods[0].b);
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  task.date = year + "/" + month + "/" + day;
  task.tags = '';
  task.status = 1;
  task.periods = JSON.stringify(reqData.periods);
  task.user_id = 1;

  connection.query('INSERT INTO tasks SET ?',
    task,
    function(err, rows, fields) {
      if (err) throw err;
      reqData.task.id = rows.insertId;
      res.jsonp(reqData.task);
    });
});

router.put('/task/:id', function(req, res, next) {
  var reqData = JSON.parse(req.body.data);
  var task = {};

  task.time = reqData.task.time;
  task.desc = reqData.task.name;
  task.time_str = '';
  task.project_id = reqData.task.project ? reqData.task.project.id : 1;
  task.tags = '';
  task.status = reqData.task.active ? 1 : 0;
  task.periods = JSON.stringify(reqData.periods);
  task.user_id = 1;

  connection.query('UPDATE tasks SET ? WHERE id = ' + req.params.id,
    task, 
    function(err, rows, fields) {
      if (err) throw err;
      res.jsonp(reqData.task);
    });
});

router.get('/projects/', function(req, res, next) {
  connection.query('SELECT * FROM `projects` WHERE `user_id` = 1',
    function(err, rows, fields) {
      if (err) throw err;
      console.log('The solution is: ', rows);
      rows = rows.map(function(row) {
        row.id = row.id.toString();
        return row;
      });
      res.jsonp(rows);
    });
});

module.exports = router;