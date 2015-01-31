var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: '1234567890MODNAR',
  resave: false,
  saveUninitialized: true
}));

var port = process.env.PORT || 9000;

app.use(express.static(__dirname + '/public'));

require('./app/routes')(app);

app.listen(port, function() {
  console.log("Node app is running at localhost:" + port);
})

exports = module.exports = app;