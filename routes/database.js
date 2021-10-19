const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/add-property", (req, res) => {
    res.render('new')
  });

  router.post("/add-property", (req, res) => {
    console.log(res)
    let query = `SELECT * FROM products
      INSERT INTO products
      (description,
      name,
      price,
      is_featured
      photo_1)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING *;`;
    // db.query(query, [products.description, products.name, products.price, products.photo_1, products.is_available, products.is_featured])
    // .then(res => res.rows)
    // .catch((err) => {
    //   console.log(err.message);
    // });
  });
  return router;
}
