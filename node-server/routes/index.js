var express = require('express');
var router = express.Router();

const config = require('config');

const url = (path) => {
  return config.server.domain + 'v' + config.server.version.major + path;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // HATEOAS
  res.status(200);
  res.send(JSON.stringify(
    {
      sign_up_url: url('/user'),
      log_in_url: url('/login'),
      log_out_url: url('/logout'),
    }
  ));
});

module.exports = router;
