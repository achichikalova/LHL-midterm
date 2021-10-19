const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render('new')
  });

  router.post("/", (req, res) => {

    console.log(req.body)
    let query = `
      INSERT INTO products
      (description,
      name,
      price,
      is_featured,
      photo_1,
      is_available)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
    db.query(query, [req.body.description, req.body.name, req.body.price, req.body.is_featured, req.body.photo_1, true])
    .then(res => res.rows)
    .catch((err) => {
      console.log(err.message);
    });
  });
  return router;
}
