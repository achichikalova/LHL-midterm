// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));
app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const dbRoutes = require("./routes/database");
const contentRoute = require("./routes/content");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/add-property", dbRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.use("/",contentRoute(db));




app.get("/login", (req, res) => {
  res.render('login', { user_id: null, error_message: null, isAdmin: null });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const values = [email];
  const sqlQuery = `SELECT * FROM users WHERE email = $1`;
  return db
    .query(sqlQuery, values)
    .then((data) => {
      const user = data.rows[0];
      const templateVars = {};
      if (!user) {
        templateVars.error_message = 'User not found';
        templateVars.user_id = null;
        return res.render("login", templateVars);
      }
      req.session['user_email'] = user.email;
      req.session['user_id'] = user.id;
      req.session['isAdmin'] = user.is_admin;
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
});

app.post('/logout', function(req, res) {
  req.session = null;
  console.log('post logout');
  res.redirect('/');
});

app.get('/about', (req, res) => {
  const user_id = req.session.user_id;
  const email = req.session.user_email;
  const isAdmin = req.session.isAdmin;
  const templateVars = { user_id, email, isAdmin };
  res.render('about', templateVars);
});

app.get("/views/details/:id", (req, res) => {
  console.log(req.params.id)
  db.query("SELECT * FROM properties WHERE id = $1",[req.params.id]) .then (result => {
    console.log(result.rows)
    res.render('details',{product:result.rows[0], user_id: null})
  })


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
