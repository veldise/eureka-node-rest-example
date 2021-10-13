'use strict';
const express = require('express');
const router = express.Router();

const { v4: uuidV4 } = require('uuid');
const _ = require('lodash');

let tempHeader = [
    { name: 'id', type: 'TEXT' },
    { name: 'name', type: 'TEXT' },
    { name: 'random', type: 'REAL' },
];
let tempList = _.map(_.range(3), function (num) {
    return [
        uuidV4(), // id
        'test_' + num, // name
        Math.random() // random
    ];
});

// CREATE
router.post('/', function(req, res) {
    let newId = uuidV4();
    let newItem = [
        newId,
        req.body.name || '',
        req.body.random || Math.random()
    ];

    tempList.push(newItem);

    res.json({
        success: {
            code: 0,
            messages: 'create success.'
        },
        data: _.zipObject(_.map(tempHeader, 'name'), newItem)
    });
});

// READ
router.get('/:id?', function(req, res) {
    let id = req.params.id;

    if (!id) {
        res.json({
            data: {
                fields: tempHeader,
                results: tempList
            }
        });
    }
    else {
        let found = _.find(tempList, function (row) {
            return row[0] === id;
        });

        res.json({
            data: _.zipObject(_.map(tempHeader, 'name'), found)
        });
    }
});

// UPDATE
router.put('/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;
    if (!id) {
        res.status(403).send('empty id');
        return;
    }

    let found = _.find(tempList, function (row) {
        return row[0] === id;
    });
    if (!found) {
        res.status(404).send('not found');
        return;
    }

    if (body.name) {
        found[1] = body.name;
    }
    if (body.random) {
        found[2] = body.random;
    }

    res.json({
        success: {
            code: 0,
            messages: 'update success.'
        },
        data: _.zipObject(_.map(tempHeader, 'name'), found)
    });
});
// DELETE
router.delete('/:id', function(req, res) {
    let id = req.params.id;
    if (!id) {
        res.status(403).send('empty id');
        return;
    }

    let found = _.find(tempList, function (row) {
        return row[0] === id;
    });
    if (!found) {
        res.status(404).send('not found');
        return;
    }

    _.remove(tempList, function (row) {
        return row[0] === id;
    });

    res.send({
        success: {
            code: 0,
            messages: 'delete success.'
        },
        data: id
    });
});

module.exports = router;
