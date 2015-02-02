"use strict";

var path = require('path');
var request = require('request');

module.exports = function(app) {

    app.get('*', function(req, res, next) {
        console.log(new Date().toISOString() + ': ' + req.originalUrl);
        next();
    });

    app.get('/login', function(req, res) {
        var appId = process.env.APP_ID || "localhost";
        res.redirect('https://cloudpoint.herokuapp.com/login/' + appId);
    });

    app.get('/logout', function(req, res) {
        console.log('Not logged in');
        delete req.session.loginData;
        res.sendFile(path.join(__dirname, '../public/views/notLoggedIn.html'));
    });

    app.get('/login_response', function(req, res) {
      var token = req.query.id;
      var secret = process.env.TIMES || "localhost";
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
            console.log(loginData);
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