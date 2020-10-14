const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let User = require('./models/user');

// configuring the local strategy to use our own authentication strategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// passport.authenticate will mount the user property to the req object
// so we can access using req.user
// Since we are tracking the user based on sessions 
// for passport to support we need to serialize and deserialize the user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());