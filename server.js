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
  port: 3307,
  user: "root",
  password: 'password',
  database: "company"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.get("/api/pets", (req, res) => {
  con.query("SELECT * FROM company.pet", function(err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});
app.get("/api/", (req, res) => {
    con.query("SELECT * FROM company.pet", function(err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

//app listen on port 5000
app.listen(port, () => console.log(`Listening on port ${port}`));