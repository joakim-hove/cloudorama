var path = require('path');
var request = require('request');
var express = require('express');
var router = express.Router();

router.route('/login')
.get(function(req, res) {
    var appId = process.env.APP_ID || "localhost";
    res.redirect('https://cloudpoint.herokuapp.com/login/' + appId);
});

router.route('/logout')
.get(function(req, res) {
    req.session.regenerate(function onComplete(err) {
      // req.session is clean
    })
    res.sendFile(path.join(__dirname, '../../public/views/notLoggedIn.html'));
});

router.route('/login_response')
.get(function(req, res) {
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

router.route('*')
.get(function(req, res) {
    if (req.session.userData === undefined) {
        console.log('User not logged in. Redirected to login page.');
        res.sendFile(path.join(__dirname, '../../public/views/notLoggedIn.html'));
    }
    else {
        res.sendFile(path.join(__dirname, '../../public/views/index.html'));
    }
});

module.exports = router;

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