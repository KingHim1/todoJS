const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to database
var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: 'kmgj58_todo',
  database: "todo"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    next();
  });
app.get("/api/pets", (req, res) => {
  con.query("SELECT * FROM todo.Users", function(err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/', (req, res) => {
  console.log(req)
  res.send('You hit the home page without restarting the server automatically\n')
})

app.get("/api/", (req, res) => {
    con.query("SELECT * FROM todo.Users", function(err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/test", (req, res) => {
    con.query("SELECT * FROM todo.Users", function(err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
//app listen on port 5000
app.listen(port, () => console.log(`Listening on port ${port}`));