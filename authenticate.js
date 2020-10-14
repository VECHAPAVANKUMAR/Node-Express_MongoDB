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
// so we can access using req.user
// Since we are tracking the user based on sessions 
// for passport to support we need to serialize and deserialize the user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        // expiresIn in seconds 3600 is expires in one hour
        expiresIn : 36000
    });
}

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    // done is the callback that the passport provides it as parameter
    (jwt_payload, done) => {
        console.log('jwt_payload', jwt_payload);
        User.findOne({_id : jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, true);
            } else {
                return done(null, false);
            }
        })

    }))

exports.verifyUser = passport.authenticate('jwt', {session : false})

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next()
    } else {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end('Unauthorized');
    }
}