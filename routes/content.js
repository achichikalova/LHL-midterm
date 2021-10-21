const express = require('express');
const router  = express.Router();

router.get("/", (req, res) => {

  console.log(req.body);
  let query = `
    SELECT
    *
    FROM properties;`;
  db.query(query)
    .then(res => {
      res.rows
      console.log("log3", res.rows);
    })

    .catch((err) => {
      console.log(err.message);
    });
  return router;
});




//[req.body.photo_1] req.body.title, req.body.description, req.body.type, req.body.price, req.body.is_featured,, true
