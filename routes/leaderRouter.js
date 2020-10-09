// Express
const express = require('express');
// Body parser
const bodyParser = require('body-parser');
// Router app
const leaderRouter = express.Router();
// Models
const Leader = require('../models/leaders');
// Verify user token
var verifyUser = require('../authenticate');


var authenticate = require('../authenticate');
leaderRouter.use(bodyParser.json());

// Routes
leaderRouter.route('/')
.get((req,res,next) => {
    Leader.find({})
        .then((leaders) => {
            res.statusCode = 200;
            res.contentType('application/json');
            res.json(leaders);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post([authenticate.verifyUser, authenticate.verifyAdmin], (req, res, next) => {
    Leader.create(req.body)
        .then((leader) => {
            console.log("Leader created: ", leader);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put([authenticate.verifyUser, authenticate.verifyAdmin], (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete([authenticate.verifyUser, authenticate.verifyAdmin], (req, res, next) => {
    Leader.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.contentType('application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leader.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.contentType('application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post([authenticate.verifyUser, authenticate.verifyAdmin], (req, res, next) => {
    res.end(req.method + ' operation not supported on /leaders/' + req.params.leaderId);
})
.put([authenticate.verifyUser, authenticate.verifyAdmin], (req, res, next) => {
    Leader.findByIdAndUpdate(req.params.leaderId, { $set: req.body}, {new: true})
        .then((leader) => {
            res.statusCode = 200;
            res.contentType('application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete([authenticate.verifyUser, authenticate.verifyAdmin], (req, res, next) => {
    Leader.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;