var path = require('path');
var request = require('request');
var mongoose = require('mongoose');
var Item = require('./models');

module.exports = function(app) {

    app.get('*', function(req, res, next) {
        console.log(new Date().toUTCString() + ': ' + req.originalUrl);
        next();
    });

    app.get('/login', function(req, res) {
        var appId = process.env.APP_ID || "localhost";
        res.redirect('https://cloudpoint.herokuapp.com/login/' + appId);
    });

    app.get('/logout', function(req, res) {
        req.session.regenerate(function onComplete(err) {
          // req.session is clean
        })
        res.sendFile(path.join(__dirname, '../public/views/notLoggedIn.html'));
    });

    app.get('/login_response', function(req, res) {
      var token = req.query.id;
      var secret = process.env.SECRET || "localhost";
      var url = 'https://cloudpoint.herokuapp.com/validate?secret=' + secret + '&id=' + token;
      console.log('Requesting login data from ' + url);
      request({
        uri: url,
        followRedirect: true
        }, function (error, response, body) {
        if (error) {
            var errorMsg = 'Error getting ' + url + error;
            if (response !== undefined) {
                errorMsg += 'Response code: ' + response.statusCode
            }
            console.log(errorMsg);
            res.send("Could not connect to " + url + "<br>Login failed. " + error);
        }
        else {
            console.log("Storing user data in session");
            var userData = convertUserData(body);
            req.session.userData = userData;
            res.redirect('/');
        }
      });
    });

    app.get('/api/*', function(req, res, next) {
        if (req.session.userData === undefined) {
            res.status(401).send("Unauthorized");
        } else {
            next();
        }
    });

    app.post('/api/*', function(req, res, next) {
        if (req.session.userData === undefined) {
            res.status(401).send("Unauthorized");
        } else {
            next();
        }
    });

    
    app.get('/api/dataItems', function(req, res) {
        var userId = req.session.userData.userId;
        var query = Item.where({_id : userId});
        query.findOne(function(err, items) {
            if (err) { res.send(err); }
            else {
                res.json(items);
            }
        });
    });

    app.post('/api/dataItems', function (req, res) {
        var input = req.body;
        var userId = req.session.userData.userId;
        var query = Item.where({_id : userId});
        query.findOne(function (err, itemsForUser){
            if (err) { return console.error(err); }
            if (!itemsForUser) {
                var newItem = new Item({'_id' : userId, 'items': [input.item]});
                saveItemAndReturnResponse(newItem, res);
            }
            else {
                if (itemsForUser.items.indexOf(input.item) == -1) {
                    itemsForUser.items.push(input.item);
                }
                saveItemAndReturnResponse(itemsForUser, res);
            }
        });
    });

    app.delete('/api/dataItems/', function (req, res) {
        var itemToRemove = req.query.item;
        var userId = req.session.userData.userId;
        var query = Item.where({_id : userId});
        query.findOne(function (err, itemsForUser){
            if (err) { return console.error(err); }
            if (!itemsForUser || itemsForUser.items.indexOf(itemToRemove) == -1) {
                res.status(400).send("item does not exits");
            }
            else {
                itemsForUser.items.remove(itemToRemove);
                saveItemAndReturnResponse(itemsForUser, res);
            }
        });
    });

    app.get('/api/userData', function(req, res) {
        res.json(req.session.userData);
    });

    app.get('*', function(req, res) {
        if (req.session.userData === undefined) {
            console.log('User not logged in. Redirected to login page.');
            res.sendFile(path.join(__dirname, '../public/views/notLoggedIn.html'));
        }
        else {
            res.sendFile(path.join(__dirname, '../public/views/index.html'));
        }
    });
};

function convertUserData(userDataFromAD) {
    var json = JSON.parse(userDataFromAD);
    return {
        "name" : json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        "title" : json["title"],
        "email" : json["urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress"],
        "userId" : json["urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress"].split("@")[0],
        "phone" : json["phone"],
        "office" : json["physicalDeliveryOfficeName"],
        "dept" : json["extensionAttribute3"] + " " + json["extensionAttribute6"],
        "photo" : json["thumbnailPhoto"]
    };
}

var saveItemAndReturnResponse = function(item, res) {
    item.save(function (err, newItem) {
         if (err) {
             return console.error(err);
         }
         res.location('/api/dataItems');
         res.status(201).send("ok");
    });
}