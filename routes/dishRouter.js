const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

// Like for /dishes end point we will have ALL, GET, PUT, POST, DELETE methods
// for every other end point. So, if we write all of them in a single index.js file then
// our application will become so comebursome.
// To handle this we have express router where we will write ALL, GET, POST, PUT, DELETE 
// for each end point seperately and then we will mount each express router
// with corresponding route in index.js file. 
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());
// All the below methods ALL, GET, POST, PUT, DELETE are grouped and are implemented
// on the dishRouter and for this particular router all the methods are chained together
dishRouter.route('/')

.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        // res.json() will take json object as parameter and sents backs to the client
        res.json(dishes);
    }, err => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    // Since we applied the body parser whatever there in the body of the request and adds
    //  back to the req object as req.body we can directly create the dish by passing req.body
    // as parameter to Dishes.create()
    Dishes.create(req.body)
    .then((dish) => {
        console.log("Dish created : " + dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => next(err))
})
// PUT operation on /dishes endpoint does not make any value 
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported on /dishes`);
})
.delete((req, res, next) => {
    Dishes.deleteMany({})
    .then((resp) => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, err => next(err))
    .catch((err) => next(err))
})

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/:${req.params.dishId}`)
})
.put((req, res, next) => {
    // To return the updated dish we need to enable the bew flag
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set : req.body
    }, { new : true })
    // Here dish is dish after updated
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => next(err))
})
.delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
    // Here dish is removed dish
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => next(err))
})

module.exports = dishRouter;