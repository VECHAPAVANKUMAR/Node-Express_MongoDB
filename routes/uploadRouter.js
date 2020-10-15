const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

let storage = multer.diskStorage({
    // destination indicates where the uploaded images are to be stored
    destination : (req, file, callback) => {
        callback(null, 'public/images')
    },
    filename : (req, file, callback) => {
        // after uploading the image then that image file is 
        // saved with the file original name itself
        // if you don't configure this multer will give a random string as 
        // name which would not be good
        callback(null, file.originalname);
    }
});

const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('You can upload only image files!', false));
    } else {
        callback(null, true);
    }
}

const upload = multer({storage : storage, fileFilter : imageFileFilter})

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})

// imageFile is name of the key and image is the value
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;