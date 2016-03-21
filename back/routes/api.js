var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'chronacc'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('api');
  connection.connect();

  connection.query('SELECT * FROM `tasks` WHERE `user_id` = 1 ORDER BY `id` DESC LIMIT 0, 10', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows);
    res.send('api', rows);
  });

  connection.end();
});

module.exports = router;
