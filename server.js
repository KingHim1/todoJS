const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
var session = require('express-session');
const port = process.env.PORT || 5000;
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to database
var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: 'pw',
  database: "todo"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.use(express.json());
app.use((req, res, next) => {
    req.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization, origin, access-control-allow-origin'); 
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });
app.get("/api/pets", (req, res) => {
  con.query("SELECT * FROM todo.Users", function(err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});
app.post('/auth', (request, response) => {
  console.log(request.body);
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM todo.Users WHERE name = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
        console.log('correct username and pass')
				request.session.loggedin = true;
        request.session.username = username;
        response.send('/home');
        console.log("test")
			} else {
        console.log('Incorrect username and/or Password! ! !')
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
app.get('/home', function(request, response) {
  console.log("home")
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
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
//need to add condition on user todo
app.get("/api/todos", (req, res) => {
  con.query("SELECT * FROM todo.todos WHERE todo.user = user.user", function (err, result, field) {
    if (err) throw err;
    res.send(result);
  });
});
// // Need to add post to create posts 
// app.post("/api/todos", (req, res) => {
//   con.query("SELECT * FROM todo.todos WHERE todo.user = user.user", function (err, result, field) {
//     if (err) throw err;
//     res.send(result);
//   });
// });
// // Need to add put to create posts 
// app.put("/api/todos", (req, res) => {
//   con.query("SELECT * FROM todo.todos WHERE todo.user = user.user", function (err, result, field) {
//     if (err) throw err;
//     res.send(result);
//   });
// });
//app listen on port 5000
app.listen(port, () => console.log(`Listening on port ${port}`));