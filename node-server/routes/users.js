var express = require('express');
var router = express.Router();
var validator = require('validator');
const config = require('config');
const { v4: uuidv4 } = require('uuid');
const md5 = require('md5'); 
var nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

//
const User = require('../models/user');

const v = (path) => {
  return '/v' + config.server.version.major + path;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findOne({uuid: req.session.uuid},
      (err, result) => {
    if (err || !result) {
      res.status(401);
      res.send(JSON.stringify(
        {
          code: 404,
          msg: 'Not Found'
        }
      ));
    } else {
      console.log(result);
      res.status(200);
      res.send(JSON.stringify(
        {
          code: 200,
          msg: 'success',
          data: {
            fullName: result.fullName
          }
        }
      ));
    }
  });
});

// add a user with email, password and full name
router.post('/', function(req, res, next) {
  // 1. req.body.email password fullName
  let email = req.body.email;
  let password = req.body.password;
  let fullName = req.body.fullName;

  // 2. validation. 400
  if (!email) {
    res.status(400);
    res.send(JSON.stringify(
      {
        code: 400,
        msg: 'Email is required'
      }
    ));
    return;
  }

  if (!email || !validator.isEmail(email)) {
    res.status(400);
    res.send(JSON.stringify(
      {
        code: 400,
        msg: 'Email is not valid'
      }
    ));
    return;
  }

  if (!password) {
    res.status(400);
    res.send(JSON.stringify(
      {
        code: 400,
        msg: 'Password is required'
      }
    ));
    return;
  }

  if (!fullName) {
    res.status(400);
    res.send(JSON.stringify(
      {
        code: 400,
        msg: 'FullName is required'
      }
    ));
    return;
  }

  // 3. email exists already? 409
  User.findOne({email: email, confirmed: true}, (err, result) => {
    if (!result) {
      if (!config.email) {  // no email server
        res.status(501);
        res.send(JSON.stringify(
          {
            code: 501,
            msg: 'Not Implemented'
          }
        ));
        return;
      }

      // 4. put sign up info into db, send confirmatioin email.
      const user = {
        uuid: uuidv4(), // Create a new uuid.
        email: email,
        password: md5(password),  // Do not save the clear text!
        fullName: fullName,
        locked: false,
        confirmed: false
      };

      new User(user).save()
        .then((result) => {
          // 4.2 send email ...
          const transporter = nodemailer.createTransport({
            service: config.email.service,
            auth: {
              user: config.email.auth.user,
              pass: config.email.auth.pass,
            }
          });

          const mailOptions = {
            from: config.email.auth.user,
            to: email,
            subject: 'Enchanted Notebook - confirmation',
            text: 'Here: ' + config.server.domain + v('users/') + user.uuid
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log(info);
            }
          });

        }).catch(err => {
          console.error('insert db failed:', err);
        });
    } else {
      res.status(409);
      res.send(JSON.stringify(
        {
          code: 409,
          msg: 'Email has already existed'
        }
      ));
      }
  });
});

// from confirmation email
router.get('/:uuid', function(req, res, next) {
  User.findOne({uuid: req.params.uuid}, (err, result) => {
    if (err && !result) {
      res.status(404);
      res.send(JSON.stringify(
        {
          code: 404,
          msg: 'Not Found'
        }
      ));
    } else {
      result.confirmed = true;
      result.save(err => {
        if (!err) {
          fs.mkdir(path.join(__dirname, '..', config.server.repoDir, req.params.uuid), (err) => {
            if (err) {
              // [Error: EEXIST: file already exists, mkdir '...'] {
              // errno: -4075,
              // code: 'EEXIST',
              //syscall: 'mkdir',
              // path: '...'

              // confirm multiple times, ignore
            }
          });

          res.status(200);
          res.send(JSON.stringify(
            {
              code: 200,
              msg: 'success'
            }
          ));
        }
      });
    }
  });
});

// change password
router.put('/', function(req, res, next) {
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  // validate
  if (!newPassword) {
    res.status(400);
    res.send(JSON.stringify(
      {
        code: 400,
        msg: 'Bad Request'
      }
    ));

    return;
  }

  User.findOne({uuid: req.session.uuid, password: md5(oldPassword)}, 
      (err, result) => {
    if (err || !result) {
      res.status(401);
      res.send(JSON.stringify(
        {
          code: 401,
          msg: 'Unauthorized'
        }
      ));
    } else {
      // not allow Testers to change the password
      if (result.email === 'test@test.com' && config.demo) {
        res.status(403);
          res.send(JSON.stringify(
            {
              code: 503,
              msg: 'Forbidden'
            }
          ));
        return;
      }

      // ! Do NOT save the original password !
      result.password = md5(newPassword);
      result.save(err => {
        if (!err) {
          res.status(200);
          res.send(JSON.stringify(
            {
              code: 200,
              msg: 'success'
            }
          ));
        }
      });
    }
  });
});

module.exports = router;
