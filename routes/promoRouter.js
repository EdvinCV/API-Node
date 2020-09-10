// Express
const express = require('express');
// Body parser
const bodyParser = require('body-parser');
// Router app
const promoRouter = express.Router();
// Models
const Promotion = require('../models/promotions');

// Middlewares
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
    Promotion.find({})
        .then((proms) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(proms);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req, res, next) => {
    Promotion.create(req.body)
        .then((prom) => {
            console.log("Promotion created ", prom);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(prom);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promotion.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.contentType('json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

promoRouter.route('/:promotionId')
.get((req,res,next) => {
    Promotion.findById(req.params.promotionId)
        .then((prom) => {
            res.statusCode = 200;
            res.contentType('application/json');
            res.json(prom);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req, res, next) => {
    res.end(req.method + ' operation not supported on /promotions/' + req.params.promotionId);
})
.put((req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, { $set: req.body}, { new: true})
        .then((prom) => {
            res.statusCode = 200;
            res.contentType('application/json');
            res.json(prom);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete((req, res, next) => {
    Promotion.findByIdAndRemove(req.params.promotionId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;