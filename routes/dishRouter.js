const express = require('express');
const bodyParser = require('body-parser');
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
// This method is executed by default irrespective of the request GET, POST, PUT, DELETE is make to 
//  /dishes endpoint.
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // Becuase of calling the next() after all method executed then its corresponding actual method wll execute.
    // That is if the request to /dishes is GET Method then after executing the ALL Method
    // then corresponding GET Method will be executed.
    next();
})
.get((req, res, next) => {
    // Here if we modify the req, res in the above any of the middlewares or methods then the
    // modified req, res will be obtained as parameter to this.
    // That is if we modify the req and res in ALL Method of /dishes then this modified
    // req and res will be passed as parameters to GET Method of /dishes
    res.end('Will send all the dishes to you');
})
.post((req, res, next) => {
    res.end(`Will add the dish: ${req.body.name} with details ${req.body.description}`);
})
// PUT operation on /dishes endpoint does not make any value 
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported on /dishes`);
})
.delete((req, res, next) => {
    res.end(`Deleting all the dishes`);
})
module.exports = dishRouter;