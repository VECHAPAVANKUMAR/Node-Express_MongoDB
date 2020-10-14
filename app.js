var createError = require('http-errors');
var express = require('express');
var path = require('path');
// This is used to issue the cookies and signed cookies to 
// the client once he gets authorized
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// conFusion is the database
const url = 'mongodb://127.0.0.1:27017/conFusion';
var connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected to the server correctly');
})
.catch((err) => {
  console.log(err);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Implementing signed cookies which are send once client get authorized
// The reason for using cookies is as we know that in order for client to access any 
// endpoint he need to get authorized for every request because we apply auth middleware
// before accesing the any endpoints which is required.
// cookies are limited in size.
// For signed cookie we nee to pass our secret key to the cookie parser
app.use(cookieParser('This is my secret key'));
// Implementing Authentication of the user
auth = (req, res, next) => {
	console.log(req.headers);
	console.log('Signed Cookie ', req.signedCookies);
	// user is our cookie name which we will issued once user get authorized 
	if (!req.signedCookies.user) {
		let authHeader = req.headers.authorization;
		// checking whether the autherization header is present in incoming request
		if (!authHeader) {
		let err = new Error('You are not authenticated');
		// Basic Authentication means username and password based authentication
		// So, in the request we need to pass the username and password in the Authentication header as
		// Authentication : Basic base64 encoded format of username and password seperated by : 
		// between username and password
		// That is username:password
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = 401;
		next(err);
		return;
		} else { // Here the user has set the Authorization Hedaer in the request
		// so we are extracting the username and password from the authenticatinn header
			let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(":")
			const username = auth[0];
			const password = auth[1];
		// If valid user then the request is forwarded to next
		if (username === "admin" && password === "password") {
			// Now the user is valid so we will send a signed cookie in the res object
			// baxk to the client. Due, to which from now every req that user makes
			// this signed cookie will automatically added to req object.
			// user is the name with which our cookie is saved
			// admin is name of the user
			// enable signed flag to create signed Cookie
			res.cookie('user', 'admin', {signed : true});
			next();
		} else {
			let err = new Error('You are not authenticated');
			res.setHeader('WWW-Authenticate', 'Basic');
			err.status = 401;
			next(err);
			}
		}
	} else {
		if (req.signedCookies.user === 'admin') {
			next()
		} else { // This will not happend usually
			let err = new Error('You are not authenticated');
			err.status = 401;
			next(err);
		}
	}
}
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
