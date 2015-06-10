var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/hellow';
var BEACH_LIST = [];


/*
exports.findBeach = function (req, res, next) {
    var name = req.params.name;
    console.log(getDateTime() + " * Find beach called - " + name);

    //TODO 검색 & 필터링 로직 구현할것.

    var resultJSON;

    if(name) {
        resultJSON = _.filter(dummy, function(element) {
            return element._name.indexOf(name) > -1;
        });
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(resultJSON));
    } else {
        res.writeHead(200, {"Content-Type": "application/json"});
        resultJSON = [];
        res.end(JSON.stringify(resultJSON));
    }

    //res.writeHead(200, {"Content-Type": "application/json"});
    //res.end(JSON.stringify(tmpJSON, null, 2));
    //
    //res.end(JSON.stringify(resultJSON));
};

exports.getAllList = function (req, res, next) {
    console.log(getDateTime() + " * getList called");
    //var _list = _.map(dummy, function(obj) {
    //    return _.pick(obj, '_id', '_name');
    //});
    //
    var _list = _.sortBy(_.map(dummy, function(obj) {
        return _.pick(obj, '_id', '_name', '_hits');
    }), function(obj) {
        return -obj._hits;
    });
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(_list));
};

exports._getAllList = function (req, res, next) {
    console.log(getDateTime() + " * _getAllList called");
    if (BEACH_LIST.length) {
        responseEnd(res, req.params.name);
    } else {
        dbConnectTo(getBeachList, req, res);
    }
};

*/

exports._findBeach = function (req, res, next) {
    console.log(getDateTime() + " * _findBeach called");
    if (BEACH_LIST.length) {
        responseEnd(res, req.params);
    } else {
        dbConnectTo(getBeachList, req, res);
    }
};

/////////////////////////////////////////////////////////////////////////////////////

var dbConnectTo = function(method, req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

        method(db, req, res, function() {
            responseEnd(res, req.params);
            db.close();
        });
    });
};

/////////////////////////////////////////////////////////////////////////////////////

var getBeachList = function(db, req, res, callback) {
    var cursor = db.collection('beach').find({}, {"id": 1, "_name": 1, "_hits": 1}).sort({"_hits": -1});

    console.log(getDateTime() + " * getBeachList from DB");
    cursor.forEach(function(doc) {
        assert.ok(doc != null);
        BEACH_LIST.push(doc);
    }, function(err) {
        assert.equal(null, err);
        callback();
    });
};

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

function responseEnd(res, str) {
    var tmp = BEACH_LIST;
    if (str.name) {
        tmp = _.filter(BEACH_LIST, function (element) {
            return element._name.indexOf(str.name) > -1;
        });
    }
    tmp = _.sortBy(tmp, function(obj) {
        return -obj._hits;
    });
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(tmp));
}
