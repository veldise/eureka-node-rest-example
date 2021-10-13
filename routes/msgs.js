'use strict';
const express = require('express');
const router = express.Router();

// const _ = require('lodash');

router.get('/error/:code?', function(req, res) {
    let code = req.params.code;

    code = (code) ? parseInt(code) : -1;

    let statusCode = 200;
    if (200 <= code && code < 600) {
        statusCode = code;
    }

    res.status(statusCode).json({
        error: {
            code: code,
            messages: 'test error message.'
        }
    });
});

router.get('/success', function(req, res) {
    res.json({
        success: {
            code: 0,
            messages: 'test success message.'
        }
    });
});

module.exports = router;
