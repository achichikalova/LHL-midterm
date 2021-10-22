const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    const user_id = req.session.user_id;
    const isAdmin = req.session.isAdmin;
    const houseId = req.params.id;
    let houses;
    let query = `
      SELECT
      *
      FROM properties WHERE id = $1 ;`;
    db.query(query,[houseId])
      .then(result => {
        houses = result.rows;
        console.log("log3", result.rows);
        const templateVars = {
          user_id,
          isAdmin,
          houses
        };
        console.log(templateVars.houses);
        res.render("details", templateVars);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
  return router;
};
