const mysql = require('mysql');

 /* const dbConn = mysql.createPool({
  connectionLimit: 100, //important
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mazola_admin',
  debug: false
});   
 /**/
//Create db connection
/* const dbConn = mysql.createConnection({
  host     : 'eu-cdbr-west-01.cleardb.com',
  user     : 'b8235e3a8f8a1a',
  password : '635fd4be',
  database : 'heroku_c449ea1974c8140'
}); */

// const dbConn = mysql.createPool({
//   connectionLimit: 100, //important
//   host: 'dbseeded.cycabjdejgwp.me-south-1.rds.amazonaws.com',
//   user: 'mazola_admin',
//   password: 'mazolaadmin',
//   database: 'mazola-prod-v3',
//   debug: false
// });    


const dbConn = mysql.createPool('mysql://vhqf50il0kasobqeb1kd:pscale_pw_4CmYc2PGjSgNbtE3Mj7IRG1uAXpE7D9qxfhtMlQOlgi@aws-eu-west-2.connect.psdb.cloud/boualvard?ssl={"rejectUnauthorized":true}');    
dbConn.getConnection(function (err, connection) {
  if (err) throw err;
  console.log("Database Connected!");
})
module.exports = dbConn