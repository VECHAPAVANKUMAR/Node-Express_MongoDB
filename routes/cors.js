const express = require('express');
const cors = require('cors');
const app = express();

// whiteList contains all the origins/domains from which server is willing to accept
const whiteList = ['http://localhost:3000', 'https://localhost:3443'];

var corsOptionsDelegate = (req, callback) => {
    
    var corsOptions;

    if (whiteList.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin : true};
    } else {
        corsOptions = {origin : false};
    }

    callback(null, corsOptions);
}
// Allows request from all domains 
exports.cors = cors();
// Allows requests from only whitelisted domains
exports.corsWithOptions = cors(corsOptionsDelegate);