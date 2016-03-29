var mongo = require('mongodb').MongoClient;

module.exports = function Database(callback) {
  var self = this;

  mongo.connect(process.env.MONGO_URI, function(err, db) {
    if (err) return console.log(err);
    self.collection = db.collection(process.env.MONGO_COLLECTION);
    callback();
  });

  this.latestQuery = function(cb) {
    self.collection.find().sort({ $natural : -1 }).limit(10).toArray(function(err, data) {
      if (err) return cb(err);
      cb(null, data);
    });
  }

  this.insertQuery = function(query, cb) {
    self.collection.insert({query : query, date: new Date()}, function(err) {
        if (err) return cb(err);
        cb();
    });
  };
  return this;
}
