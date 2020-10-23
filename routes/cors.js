const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = [
    'http://localhost:3000',
    'https://localhost:3433'
];

const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

exports.cors = cors();
exports.corsOptions = cors(corsOptions);
