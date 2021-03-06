const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
let passport = require('passport');
const authenticate= require('../authenticate');
const cors = require('./cors');

const router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users)
    }, err => next(err))
    .catch((err) => next(err));
});

router.route('/signup')
.post(cors.corsWithOptions, (req, res, next) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json(err);
        } else {

            if (req.body.firstname) {
                user.firstname = req.body.firstname;
            }
            
            if (req.body.lastname) {
                user.lastname = req.body.lastname;
            }
            
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(err);
                    return;
                }
            })
            // Perform login operation to ensure that signup happend correctly
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success : true, status: 'Registration Successful!', user: user});
            });
        }
    });    
  });

router.route('/login')
// Here first passport.authenticate() middleware is applied if the authentication
// success then (req, res) callback is executed but if failed then appropriate error
// message will sent back to the client automatically by passport.authenticate()
.post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

    let token = authenticate.getToken({_id : req.user._id})
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success : true, token : token, status: 'You are loggin sucessfully!'});
})

router.route('/logout')
.get(cors.corsWithOptions, (req, res, next) => {

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