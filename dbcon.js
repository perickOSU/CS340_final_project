var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_perick',
  password        : 'newpass',
  database        : 'cs340_perick'
});
module.exports.pool = pool;
