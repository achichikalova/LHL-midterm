const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user_id = req.session.user_id;
    const email = req.session.user_email;
    const isAdmin = req.session.isAdmin;
    const templateVars = { user_id, email, isAdmin };
    if (!isAdmin) {
      res.redirect('/');
    }
    res.render('new', templateVars);
  });

  router.post("/", (req, res) => {

    console.log(req.body)
    let query = `
      INSERT INTO products
      (title,
      description,
      type,
      price,
      is_featured,
      photo_1,
      is_available)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
    db.query(query, [req.body.title, req.body.description, req.body.type, req.body.price, req.body.is_featured, req.body.photo_1, true])
    .then(res => res.rows)
    .catch((err) => {
      console.log(err.message);
    });
  });
  return router;
}
