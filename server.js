// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

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

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render('login')
})

app.post("/login", (req, res) => {
  const email = req.body.email;
  const values = [email];
  const sqlQuery = `SELECT * FROM users WHERE email = $1`;
  return db
    .query(sqlQuery, values)
    .then((data) => {
      const user = data.rows[0];
      if (user) {
        req.body.user_email = user.email;
        req.body.user_id = user.id;
        res.redirect("/");
      } else {
        res.send("Unauth access");
      }
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
