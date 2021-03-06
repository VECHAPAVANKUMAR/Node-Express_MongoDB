const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let User = require('./models/user');
// cookies and sessions are not scalable but token helps in acheiving scalability
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');
// configuring the local strategy to use our own authentication strategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// passport.authenticate will mount the user property to the req object
// upon sucessfull authentication
// so we can access using req.user
// Since we are tracking the user based on sessions 
// for passport to support we need to serialize and deserialize the user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        // expiresIn in seconds 36000 is expires in one hour
        expiresIn : 36000
    });
}

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    // done is the callback that the passport provides it as parameter
    (jwt_payload, done) => {
        User.findOne({_id : jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                // user is valid so return user which makes the passport to
                // load user object on to the request.
                return done(null, user);
            } else {
                return done(null, false);
            }
        })

    }))

exports.verifyUser = passport.authenticate('jwt', {session : false})

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        let err = new Error('You are not authorized to perform this operation!');
        res.statusCode = 403;
        return next(err);
    }
}