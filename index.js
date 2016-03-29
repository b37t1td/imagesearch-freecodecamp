var env = require('node-env-file');
try {
  env(__dirname + '/.env');
} catch (e) { }

var imgur = require('./lib/imgur');
var express = require('express');
var async = require('async');
var app = express();
var db = null;

app.set('view engine', 'jade');

app.get('/', function(req,res) {
  res.render('index', {host : req.protocol + '://' + req.get('host')});
});

app.get('/api/search/:search', function(req, res) {
  var query = req.params.search;
  var page = Number(req.query.offset) || 0;

  async.parallel([
    function(callback) {
      imgur.query(query, page,  function(err, data) {
        if (err) return callback(err);
        callback(data);
      });
    },
    function(callback) {
      db.insertQuery(query, callback);
    }
  ],function() {
    if (Array.isArray(arguments[0]) !== true) {
      res.send({}).end();
    } else {
      res.send(arguments[0]).end();
    }
  });
});

app.get('/api/latest', function(req, res) {
  db.latestQuery(function(err, data) {
    if (err) return res.send({}).end();
    res.send(data).end();
  });
});


db = new require('./database')(function() {
  app.listen(process.env.PORT, function() {
    console.log('Application started on :' + process.env.PORT);
  });
});
