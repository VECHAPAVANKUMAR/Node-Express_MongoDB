var createError = require('http-errors');
var express = require('express');
var path = require('path');
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
app.use(cookieParser());
// Implementing Authentication of the user
auth = (req, res, next) => {
  console.log(req.headers);
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
      next();
    } else {
		let err = new Error('You are not authenticated');
		res.setHeader('WWW-Authenticate', 'Basic');
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
