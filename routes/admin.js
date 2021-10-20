const express = require("express");
const router = express.Router();

module.exports = (db) => {

  //Removing a property
 router.post("/:properties_id/delete", (req, res) => {
  const sqlQuery = `DELETE FROM properties WHERE id = $1;`;
  const values = [req.params.properties_id];
  db.query(sqlQuery, values)
    .then((data) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
});

//Marking a property as sold
router.post("/:properties_id/sold", (req, res) => {
  const sqlQuery = `UPDATE properties SET photo_1 = '' WHERE id = $1;`;
  const values = [req.body.properties_id]; //check it later
  db.query(sqlQuery, values)
    .then((data) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
});

return router;
};
