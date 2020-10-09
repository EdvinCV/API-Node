var express = require('express');
// Body parser
const bodyParser = require('body-parser');
// User schema
const User = require('../models/users');
const passport = require('passport');
var router = express.Router();
var authenticate = require('../authenticate');
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', [authenticate.verifyUser, authenticate.verifyAdmin] , function(req, res, next) {
  User.find()
    .then((users) => {
      return res.status(200).json({
        message: "OK",
        users
      });
    });
});

// Sign up a user
router.post('/signup', function(req, res, next){
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    } else {
      if(req.body.firstName){
        user.firstName = req.body.firstName;
      }
      if(req.body.lastName){
        user.lastName = req.body.lastName;
      }
      user.save((err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err});
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            success: true,
            status: 'Registration Successful!',
            user
          });
        });
      })

    }
  });
});

// Login a user
router.post('/deletedlogin', (req, res, next) => {
  // Si no existe una cookie dentro del request
  if(!req.session.user){
    var authHeader = req.headers.authorization;

    if(!authHeader){
      var err = new Error("You are not authenticated");
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    var username = auth[0];
    var password = auth[1];

    // Verificar si existe el usuario
    User.findOne({username: username})
      .then((user) => {
        if(user === null){
          var err = new Error("Username or password are incorrect.");
          err.status = 403;
          return next(err);
        } else if (user.password !== password) {
          var err = new Error("Username or password are incorrect.");
          err.status = 403;
          return next(err);
        }
        if(user.username === username && user.password === password){
          // res.cookie('user', 'admin', { signed: true})
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated');
        }
      })
      .catch((err) => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send('You are already authenticated');
  }
});

// Login with Passport
router.post('/login', passport.authenticate('local'), (req, res, next) => {

  var token = authenticate.getToken({_id: req.user._id});

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    success: true,
    status: "You are successfully logged in",
    token
  });
});

// Logout a user
router.post('/logout', (req, res, next) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in');
    err.statusCode = 403;
    next(err);
  }
});

module.exports = router;
