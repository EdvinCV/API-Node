// Http Errors
var createError = require('http-errors');
// Express
var express = require('express');
// Path
var path = require('path');
// Cookie parser
var cookieParser = require('cookie-parser');
// Morgan logger
var logger = require('morgan');
// Mongoose
var mongoose = require('mongoose');
// Express Session
var session = require('express-session');
// FileStore Session
var FileStore = require('session-file-store')(session);
// Config
var config = require('./config');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
const passport = require('passport');

// Mongodb URL connection
const urldb = config.mongoUrl;

const connect = mongoose.connect(urldb);

connect.then((db) => {
  console.log("Connected correctly to server");
}).catch((err) => {console.log(err);})

var app = express();

// Redirect any http insecure request to the secure https server
app.all('*', (req, res, next) => {
  if(req.secure){
    return next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Cookies middleware
// app.use(cookieParser('12345-6789'));
// Use of session
// app.use(session({
//   name: "session-id",
//   secret: "12345-6789",
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

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
