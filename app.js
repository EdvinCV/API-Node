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

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

// Mongodb URL connection
const urldb = 'mongodb://localhost:27017/conFusion';

const connect = mongoose.connect(urldb);

connect.then((db) => {
  console.log("Connected correctly to server");
}).catch((err) => {console.log(err);})

var app = express();

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
app.use(session({
  name: "session-id",
  secret: "12345-6789",
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// Authentication Middleware
function auth(req, res, next){
  console.log("SESSION", req.session);

  // Si no existe una cookie dentro del request
  if(!req.session.user){
    var err = new Error("You are not authenticated");
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  } else {
    if(req.session.user === 'authenticated'){
      next();
    } else {
      var err = new Error("You are not authenticated");
      err.status = 403;
      return next(err);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
