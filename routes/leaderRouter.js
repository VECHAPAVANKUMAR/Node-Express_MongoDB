const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

// Like for /leaders end point we will have ALL, GET, PUT, POST, DELETE methods
// for every other end point. So, if we write all of them in a single index.js file then
// our application will become so comebursome.
// To handle this we have express router where we will write ALL, GET, POST, PUT, DELETE 
// for each end point seperately and then we will mount each express router
// with corresponding route in index.js file. 
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
// All the below methods ALL, GET, POST, PUT, DELETE are grouped and are implemented
// on the leaderRouter and for this particular router all the methods are chained together
leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, err => next(err))
    .catch((err) => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, err => next(err))
    .catch((err) => next(err))
})
// PUT operation on /leaders endpoint does not make any value 
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported on /leaders`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.deleteMany({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, err => next(err))
    .catch((err) => next(err))
})

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        console.log(leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, err => next(err))
    .catch((err) => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.end(`POST method not supported on /leaders/${req.params.leaderId}`)
})
.put(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set : req.body
    },
    {new : true})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, err => next(err))
    .catch((err) => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, err => next(err))
    .catch((err) => next(err))
})
module.exports = leaderRouter;