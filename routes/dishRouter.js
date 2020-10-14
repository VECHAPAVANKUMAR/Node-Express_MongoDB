const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors');

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
// preflight request
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// get all the dishes
.get(cors.cors, (req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        // res.json() will take json object as parameter and sents backs to the client
        res.json(dishes);
    }, err => next(err))
    .catch((err) => next(err))
})
// Post a Single Dish
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported on /dishes`);
})
// delete all the dishes
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.deleteMany({})
    .then((resp) => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, err => next(err))
    .catch((err) => next(err))
})

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// get particular dish using dishId if exists
.get(cors.cors,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/:${req.params.dishId}`)
})
// Update a paricular dish using dishId if exists
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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
// delete that particular dish using dishId if exists
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
    // Here dish is removed dish
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => next(err))
})

// For Dish Comments
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// get the comments of the specified dish if exits
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        // if dish exists
        if (dish !== null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            // res.json() will take json object as parameter and sents backs to the client
            res.json(dish.comments);
        } else {
            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch((err) => next(err))
})
// post a commengt to tha specified dish 
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Since we applied the body parser whatever there in the body of the request and adds
    //  back to the req object as req.body we can directly create the dish by passing req.body
    // as parameter to Dishes.create()
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        // if dish exists
        if (dish !== null) {
            // while posting the commet we are linking the author with user id
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                // res.json() will take json object as parameter and sents backs to the client
                res.json(dish);
            })
        } else {
            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch((err) => next(err))
})
// PUT operation on /dishes endpoint does not make any value 
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported on /dishes/${req.params.dishId}/comments`);
})
// delethe all the comments that are existed for the specified dish
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish !== null) {
            // Here comments is the sub-document of dish we can not remove the commets
            // directly. So, we need to iterate and delete one by one
            for (let index = dish.comments.length - 1; index >= 0; index--) {
                dish.comments.id(dish.comments[index]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                // res.json() will take json object as parameter and sents backs to the client
                res.json(dish);
            })
        } else {
            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status = 404;
            next(err);
        }
    })
})

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// get the specified comment of specified dish if exists
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        // if dish exists and that particular comment exists in that dish comments
        if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            // res.json() will take json object as parameter and sents backs to the client
            res.json(dish.comments.id(req.params.commentId));
        } else if (dish == null) {
                err = new Error(`Dish ${req.params.dishId} not found`);
                err.status = 404;
                next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/:${req.params.dishId}/comments/${req.params.commentId}`)
})
// While updating the comment we need to allow the author name to be updated
// we should update rating, comment only
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    // Here dish is removed dish
    .then((dish) => {
        if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                // res.json() will take json object as parameter and sents backs to the client
                res.json(dish);
            })
        } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }    
    }, err => next(err))
    .catch((err) => next(err))})
// delete the specified comment for the specified dish if exists
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    // Here dish is removed dish
    .then((dish) => {
        if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                // res.json() will take json object as parameter and sents backs to the client
                res.json(dish);
            })
        } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }    
    }, err => next(err))
    .catch((err) => next(err))
})

module.exports = dishRouter;