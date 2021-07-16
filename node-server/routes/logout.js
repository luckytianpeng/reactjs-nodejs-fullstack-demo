const express = require('express');
const router = express.Router();

// log out 
router.post('/', function(req, res, next) {
  req.session.destroy();

  res.status(200);
  res.send(JSON.stringify(
    {
      code: 200,
      msg: 'success'
    }
  ));
});

module.exports = router;
