var dbConf = require('../db-config');
var MongoClient = require('mongodb').MongoClient
var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});


router.route('/*')
.get(function(req, res, next) {
    if (req.session.userData === undefined) {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
})

.post(function(req, res, next) {
    if (req.session.userData === undefined) {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
});


router.route('/dataItems')
.get(function(req, res) {
    var userId = req.session.userData.userId;
    MongoClient.connect(dbConf.url, function(err, db) {
        if(err) { return console.dir(err); }
        db.collection('items').findOne({_id:userId}, function(err, item) {
            if (!item) {
                res.send({_id:userId, items:[]});
            }
            else {
                res.json(item);
            }
        });
    });
})

.post(function (req, res) {
    var input = req.body;
    var userId = req.session.userData.userId;
    
    MongoClient.connect(dbConf.url, function(err, db) {
        if(err) { return console.dir(err); }
        db.collection('items').findOne({_id:userId}, function(err, item) {
            if (!item) {
                item = {_id: userId, items: [input.item]};
            }
            else if (item.items.indexOf(input.item) == -1) {
                item.items.push(input.item);
            }
            db.collection('items').update({_id: userId}, item, {upsert: true}, function(err, item){
                res.location('/api/dataItems');
                res.status(201).send("ok");
            });
        });
    });
})

.delete(function (req, res) {
    var itemToRemove = req.query.item;
    var input = req.body;
    var userId = req.session.userData.userId;
    
    MongoClient.connect(dbConf.url, function(err, db) {
        if(err) { return console.dir(err); }
        db.collection('items').findOne({_id:userId}, function(err, item) {
            if (!item) {
                res.status(400).send("items does not exits for " + userId);
            }
            else {
                var index = item.items.indexOf(itemToRemove);
                item.items.splice(index, 1);
                db.collection('items').update({_id: userId}, item, function(err, item){
                    res.location('/api/dataItems');
                    res.status(201).send("ok");
                }); 
            }
        });
    });
});

router.route('/userData')
.get(function(req, res) {
    res.json(req.session.userData);
});

module.exports = router;
