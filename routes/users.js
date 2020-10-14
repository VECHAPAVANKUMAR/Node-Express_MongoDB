const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');

const router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get((req, res, next) => {
    console.log(req.body);
    res.send('Will respond with a resource');
});

router.route('/signup')
.post((req, res, next) => {

    User.findOne({username: req.body.username})
    .then((user) => {
        console.log('User ', user);
      if(user != null) {
        var err = new Error('User ' + req.body.username + ' already exists!');
        err.status = 403;
        next(err);
      }
      else {
          console.log('Not Exists' + req.body.username, req.body.password);
        return User.create({
          username: req.body.username,
          password: req.body.password
        });
      }
    })    
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'Registration Successful!', user: user});
    }, (err) => next(err))
    .catch((err) => next(err));

  });

router.route('/login')

.post((req, res, next) => {

    if(!req.session.user) {

      var authHeader = req.headers.authorization;
      
      if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
    
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = auth[0];
      var password = auth[1];
    
      User.findOne({username: username})
      
      .then((user) => {
        if (user === null) {
          var err = new Error('User ' + username + ' does not exist!');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== password) {
          var err = new Error('Your password is incorrect!');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
      })
      .catch((err) => next(err));
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
  })

router.route('/logout')
.get((req, res, next) => {

    if (req.session) {
        req.session.destroy();
        // session-id is the name that we gave to our session
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        let err = new Error('You are not logged in');
        err.status = 403;
        next(err);
    }
})

module.exports = router;