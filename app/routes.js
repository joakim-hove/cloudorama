var path = require('path');
var request = require('request');
var mongoose = require('mongoose');
var Item = require('models');

/*
mongoose.connect('mongodb://localhost/items');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});
*/
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

    app.get('/api/userData', function(req, res) {
        if (req.session.userData === undefined) {
            res.status(401).send("Unauthorized");
        }
        res.json(req.session.userData);
    });
    
    app.get('/api/dataItems', function(req, res) {
            if (req.session.userData === undefined) {
                res.status(401).send("Unauthorized");
            }
            Item.find(function(err, items)) {
                if (err) {
                    res.send(err);
                }
                res.json(items);
            }
        });
        
    app.post('/api/dataItems', function (req, res) {
        console.log(req.body);
        res.json(req.body);
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
    var userDataFromADJSON = JSON.parse(userDataFromAD);
    return {
        "name" : userDataFromADJSON["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        "title" : userDataFromADJSON["title"],
        "email" : userDataFromADJSON["urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress"],
        "phone" : userDataFromADJSON["phone"],
        "office" : userDataFromADJSON["physicalDeliveryOfficeName"],
        "dept" : userDataFromADJSON["extensionAttribute3"] + " " + userDataFromADJSON["extensionAttribute6"],
        "photo" : userDataFromADJSON["thumbnailPhoto"]
    };
}