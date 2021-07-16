const express = require('express');
const router = express.Router();
const validator = require('validator');
const config = require('config');

const md5 = require('md5');

const User = require('../models/user');


// Have logged in?
router.get('/', function(req, res, next) {
  if (req.session.uuid) {
    res.status(200);
    res.send(JSON.stringify(
      {
        code: 200,
        msg: 'success'
      }
    ));
  } else {
    res.status(401); 
    res.send(JSON.stringify(
      {
        code: 401,
        msg: 'Unauthorized'
      }
    ));
  }
});

// log in 
router.post('/', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  if (! email) {
    res.status(400);
    res.send(JSON.stringify(
      {
        code: 400,
        msg: 'Email is required'
      }
    ));

    return;
  }

  if (! password) {
    res.status(400);
    res.send(JSON.stringify(
      {
        code: 400,
        msg: 'Password is required'
      }
    ));

    return;
  }

  User.findOne({email: email, password: md5(password)},
               (err, result) => {
    if (result && result.confirmed) {
      req.session.uuid = result.uuid;
      
      console.log(req.session);

      res.status(200);
      res.send(JSON.stringify(
        {
          code: 200,
          msg: 'success'
        }
      ));
    } else {
      res.status(401); 
      res.send(JSON.stringify(
        {
          code: 401,
          msg: 'Unauthorized'
        }
      ));
    }
  });
});

module.exports = router;
