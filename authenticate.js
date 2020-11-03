var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/users');
// JWT Strategy
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
// Facebook Strategy
var FacebookTokenStrategy = require('passport-facebook-token');
var config = require('./config');
const { json } = require('body-parser');

// Create token
exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("PAYLOAD" , jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
    } else {
        let err = {
            message: "You are not authorized to perform this operation",
            status: 403
        }
        next(err);
    }
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    }, (access_token, refreshToken, profile, done) => {
        User.findOne({facebookId: profile.id}, (err, user) => {
            if(err){
                return done(err, false);
            }
            if(!err && user !== null){
                return done(null, user);
            } else {
                user = new User({username: profile.displayName});
                user.facebookId = profile.id;
                user.firstName = profile.name.givenName;
                user.lastName = profile.name.fammilyName;
                user.save((err, user) => {
                    if(err){
                        return done(err, false);
                    }
                    return done(null, user);
                });
            }
        });

    }    
));


exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());