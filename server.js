const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
var session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Sequelize = require('sequelize');

const port = process.env.PORT || 5000;

let salt = "kingSalt12345";
app.use(cors({origin:['http://localhost:3000'],
methods:['GET','POST', 'OPTIONS'],
credentials: true}));

app.options('*', cors({origin:['http://localhost:3000'],
methods:['GET','POST', 'OPTIONS'],
credentials: true}));

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//connect to database
var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: 'pw',
  database: "todo"
});


const sequelize = new Sequelize(

  'todo',

  'root',

  'pw',

  {
    host: "localhost",
    port: 3306,
    dialect: 'mysql',
  }
);


sequelize

  .authenticate()

  .then(() => console.log('Connection has been established successfully.'))

  .catch(err => console.error('Unable to connect to the database:', err));



  const Users = sequelize.define('Users', {

    name: {
      type: Sequelize.STRING,
    },

    email: {
      type: Sequelize.STRING,
    },
  
    password: {
      type: Sequelize.STRING,  
    },

    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    }
    
  
  }, { timestamps: false});
  
  
  
  // create table with user model
  
  Users.sync()
  
    .then(() => console.log('User table created successfully'))
  
    .catch(err => console.log('oooh, did you enter wrong database credentials?'));
  
  
  
  // create some helper functions to work on the database
  
  const createUser = async ({ name, password, email, id }) => {
  
    return await Users.create({ name, password, email, id });
  
  };
  
 
  
  const getAllUsers = async () => {
  
    return await Users.findAll();
  
  };
  

  const getUser = async obj => {
  
    return await Users.findOne({
  
      where: obj,
  
    });
  
  };
   getUser({
    name: 'test',
  }).then(res => {console.log(JSON.stringify(res))});

con.connect(function(err) {
  if (err) throw err;
});

app.use(express.json());

app.use(session({
  secret: 'secret',
  // resave: true,
  // saveUninitialized: true
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use((req, res, next) => {
    req.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization, origin, access-control-allow-origin'); 
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    // req.session.loggedin = false;
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });


passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log(username)
      console.log(password)
      const user =  getUser({
        name: username,
      }).then(res => {
        if ( res && res.dataValues.password === password){
          done(null, res)
        }
        // console.log("invalid password")
        else {
          console.log("invalid password");
          done(null, false, "invalid password")}}
        )
        .catch(

          err => {
            console.log(err)
            // done(null, false, "error occurred")
          }
          
        );
      
      
    }    
));


app.use(passport.initialize());

app.post("/auth", passport.authenticate('local',  {
  session: true }), (req, res)=>{
  req.session.loggedin = true;
  req.session.username = res.req.body.username;
  console.log(res.req.body)
  req.session.save();
  // res.redirect('/home');
  // console.log("__ user name");
  // console.log(JSON.stringify(res));
  res.status(200)
  res.send("authenticated")
  // res.format({
  //   json: () => res.status(403).json({
  //     error: 'You must login to see this',
  //     location: 'localhost:3000/login'
  //   }),
    // html: () => res.redirect('https://login.microsoftonline.com')
    // default: () => res.redirect('https://login.microsoftonline.com')
  
});

app.post('/api/pets', (request, response) => {
  // console.log("request body ", request.body);
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM todo.Users WHERE name = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
        console.log('correct username and pass')
				request.session.loggedin = true;
        request.session.username = username;
        response.redirect('/home');
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
  // console.log("home")
	if (request.session.loggedin) {
    console.log(JSON.stringify(request.session))
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
app.get('/', (req, res) => {
  // console.log(req)
  res.send('You hit the home page without restarting the server automatically\n')
})


app.get('/api/signout', (req, res) => {
  // console.log(req)
  // res.send('You hit the home page without restarting the server automatically\n')
  if(req.session.loggedin){
    req.session.loggedin = false;
    res.send("signed out");
  }
  else{
    res.send("not logged in");
  }

})

app.get("/api/", (req, res) => {
  if(req.session.loggedin){
    console.log("logged in")
    con.query("SELECT * FROM todo.Users", function(err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
    
    );
  
  }
  else{
    res.send("not signed in")
  } 
  });
  app.get("/api/test", (req, res) => {
    con.query("SELECT * FROM todo.Users", function(err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
//need to add condition on user todo
app.get("/api/todos", (req, res) => {
  if (request.session.loggedin) {
  con.query("SELECT * FROM todo.todos WHERE todo.user = user.user", function (err, result, field) {
    if (err) throw err;
    res.send(result);
  });
}
else{
  res.send("not signed in")
}
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