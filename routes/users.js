/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.post("/favorites/:product_id", (req, res) => {
    const propertyId = req.params.product_id;
    const userId = 1;
    const sqlQuery = `INSERT INTO favorite_properties (properties_id, user_id) VALUES ($1, $2)`;
    const values = [propertyId, userId];
    db.query(sqlQuery, values)
      .then((data) => {
        console.log("data", data);
        res.redirect("/");
      })
      .catch((err) => {
        console.log("error", err);
        res.status(500).json({ err: err.message });
      });
  });
  //Rendering the favorite page
  router.get("/favorites", (req, res) => {
    const sqlQuery = `SELECT favorite_properties.id AS favorite_id, properties.photo_1, properties.title, properties.price, properties.id AS properties_id, user_id FROM favorite_properties INNER JOIN properties ON properties.id = favorite_properties.properties_id
    WHERE favorite_properties.user_id= $1;`;
    let userId = req.session.user_id;
    const values = [userId];
    console.log(values);
    db.query(sqlQuery, values)
      .then((data) => {
        const user_email = req.session.user_email;
        const user_id = req.session.user_id;
        const templateVars = { favorites: data.rows, user_id, user_email };
        res.render("favorites", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });
  return router;
};
