var express = require('express');
var app = express();
var session = require('express-session');
var MongoStore  = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./app/db-config');
var MongoClient = require('mongodb').MongoClient

var port = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: '1234567890MODNAR',
  resave: false,
  saveUninitialized: true,
  store : new MongoStore({
      url: db.url
    })
}));

app.use(express.static(__dirname + '/public'));
require('./app/routes')(app);

app.listen(port, function() {
  console.log("Node app is running at localhost:" + port);
})

exports = module.exports = app;