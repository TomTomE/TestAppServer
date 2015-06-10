var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/hellow';

/////////////////////////////////////////////////////////////////////////////////////

exports.dbConnectTo = function(whatTodo, resource) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        whatTodo(db, resource, function() { db.close(); });
    });
};

/////////////////////////////////////////////////////////////////////////////////////

exports.getBeachList = function(db, resource, callback) {
    var cursor = db.collection('beach').find({}, {"id": 1, "_name": 1, "_hits": 1, "_gridX": 1, "_gridY": 1}).sort({"_hits": -1});

    console.log(getDateTime() + " * getBeachList from DB");
    cursor.forEach(function(doc) {
        assert.ok(doc != null);
        BEACH_LIST.push(doc);
    }, function(err) {
        assert.equal(null, err);
        resource.callback(resource.res, resource.req.params);
        callback();
    });
};