'use strict';

var express = require('express'),
    router = express.Router();

// middleware
router.use(function timeLog(req, res, next) {
    console.log('Time:', Date.now());
    next();
});

// routes
router.get('/login', function(req, res) {
    res.send('Login');
});

router.get('/logout', function(req, res) {
    res.send('Logout');
});

module.exports = router;
