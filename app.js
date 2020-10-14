var createError = require('http-errors');
var express = require('express');
var path = require('path');
// This is used to issue the cookies and signed cookies to 
// the client once he gets authorized
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Since cookies are fixed in size we cannot store limited information about the user
// They just reminds the server about which client is accessing it.
// To store much information about the user then we have sessions
// session is a combination of cookie with session id and server side storage of information
// index by session id.
// sessions store in the permanent store on server side and will be wiped out from the
// memory when server restarts 
var session = require('express-session');
// session file store is used to store session information in files
var FileStore = require('session-file-store')(session);
var passport = require('passport');
// load passport local strategy
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// conFusion is the database
const url = config.mongoUrl;
var connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected to the server correctly');
})
.catch((err) => {
  console.log(err);
})

var app = express();
// for all incoming requests if the request is not secure that means req is 
// not from https then we redirect it to https
app.all('*', (req, res, next) => {
	if (req.secure) {
		return next();
	} else {
		res.redirect(307, `https://${req.hostname}:${app.get('secPort')}${req.url}`)
	}
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
