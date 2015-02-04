var express = require('express');
var app = express();
var session = require('express-session');
var MongoStore  = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var dbUrl = process.env.DBURL || "mongodb://@localhost:27017/sessionstore";
var port = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: '1234567890MODNAR',
  resave: false,
  saveUninitialized: true,
  store : new MongoStore({
      url: dbUrl
    })
}));

app.use(express.static(__dirname + '/public'));
require('./app/routes')(app);

app.listen(port, function() {
  console.log("Node app is running at localhost:" + port);
})

exports = module.exports = app;