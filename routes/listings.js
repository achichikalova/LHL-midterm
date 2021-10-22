const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user_id = req.session.user_id;
    const isAdmin = req.session.isAdmin;
    let houses;
    let query = `
      SELECT
      *
      FROM properties;`;
    db.query(query)
      .then(result => {
        houses = result.rows;
        console.log("log3", result.rows);
        const templateVars = {
          user_id,
          isAdmin,
          houses
        };
        console.log(templateVars.houses);
        res.render("index", templateVars);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
  return router;
};
