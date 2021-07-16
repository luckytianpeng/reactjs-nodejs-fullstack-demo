var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('config');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const logInRouter = require('./routes/login');
const logOutRouter = require('./routes/logout');
const fileSystemRouter = require('./routes/filesystem');

var app = express();

app.disable('x-powered-by');

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.header('Origin'));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers',
      'Origin, No-Cache, X-Requested-With, If-Modified-Since, ' +
      'Pragma, Last-Modified, Cache-Control, Expires, Content-Type, ' +
      'X-E4M-With,userId,token');
  res.header('Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, TRACE, OPTIONS');
  res.header("XDomainRequestAllowed", "1");
  if(req.method=="OPTIONS") {
    res.send(200);
    return;
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.session.secret));
app.use(express.static(path.join(__dirname, 'public')));

const fileStoreOptions = {};
app.use(session(
  {
    name: config.session.name,
    secret: config.session.secret,
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized,
    cookie: {
      sameSite: 'None', // !
      secure: true,     // !
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    store: new FileStore(fileStoreOptions),
  }
));

const v = (path) => {
  return '/v' + config.server.version.major + path;
}

// authorize
app.use('*', function (req, res, next) {
  switch (req.method) {
    case 'OPTIONS':
      return next();
  }

  switch (req.originalUrl) {
    case '/':
    case v('/login'):
    case v('/logout'):
      return next();
    case v('/users'): // sign up
      if (req.method === 'POST') {
        return next();
      }
    default:  // all others need to log in firtly
      if (req.originalUrl.startsWith(v('/users/')) && req.method === 'GET') {
        return next();
      }

      if (!req.session.uuid) {
        res.status(401); 
        res.send(JSON.stringify(
          {
            code: 401,
            msg: 'Unauthorized'
          }
        ));

        return;
      } else {
        return next();
      }
  }
});

// upload
app.use(fileUpload({
  limits: {fileSize: config.server.limits.fileSize * 1.2},
}));


app.use('/', indexRouter);
app.use(v('/users'), usersRouter);
app.use(v('/login'), logInRouter);
app.use(v('/logout'), logOutRouter);
app.use(v('/filesystem'), fileSystemRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
