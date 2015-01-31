"use strict";

var path = require('path');
var request = require('request');

module.exports = function(app) {

    app.get('*', function(req, res, next) {
        console.log(new Date().toISOString() + ': ' + req.originalUrl);
        next();
    });

    app.get('/login', function(req, res) {
        res.redirect('https://cloudpoint.herokuapp.com/login/localhost');
    });

    app.get('/login_response', function(req, res) {
      var token = req.query.id;
      var secret = "localhost";
      var url = 'https://cloudpoint.herokuapp.com/validate?secret=' + secret + '&id=' + token;
      console.log('Requesting login data from ' + url);
      request({
        uri: url,
        followRedirect: true
        }, function (error, response, body) {
        if (error) {
            if (response === undefined) {
                console.log('Error getting ' + url + error)
            }
            else {
                console.log('Error getting ' + url + error + ' Response code: ' + response.statusCode);
            }
            res.send("Could not connect to " + url + "<br>Login failed. " + error);
        }
        else {
            var loginData = JSON.parse(body);
            req.session.loginData = loginData;
            res.redirect('/');
        }
      });
    });

    app.get('/api/userData', function(req, res) {
        if (req.session.loginData === undefined) {
            res.status(401).json({ error: 'User not authenticated' }); //TODO: not working?
        }
        res.json(req.session.loginData);
    });

    app.get('*', function(req, res) {
        if (req.session.loginData === undefined) {
            console.log('Not logged in');
            res.sendFile(path.join(__dirname, '../public/views/notLoggedIn.html'));
        }
        else {
            console.log('Logged in');
            res.sendFile(path.join(__dirname, '../public/views/index.html'));
        }
    });
};