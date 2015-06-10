var _ = require('underscore');
var callRequest = require('request');
var parseString = require('xml2js').parseString;

var dbConnectTo = require('./dbHandler').dbConnectTo;
var getBeachList = require('./dbHandler').getBeachList;

BEACH_LIST = [];
var url = 'mongodb://localhost:27017/hellow';

exports._findBeach = function (req, res, next) {
    console.log(getDateTime() + " * _findBeach called");
    var resource = {
        req: req,
        res: res,
        callback: responseEnd
    };
    if (BEACH_LIST.length) {
        responseEnd(res, req.params);
    } else {
        dbConnectTo(getBeachList, resource);
    }
};

exports._detailInfo = function (req, res, next) {
    console.log(getDateTime() + " * _detailInfo called");
    var beach = BEACH_LIST[0];


    var rs = dfs_xy_conv().convert(beach._gridX, beach._gridY, "toXY");

    console.log(rs);
    getWeather(rs.nx, rs.ny, res);

};

/////////////////////////////////////////////////////////////////////////////////////
/*
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
*/

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

function getWeather(nx, ny, callback){
    var today = new Date(),
        dd = today.getDate(),
        mm = today.getMonth()+1,
        yyyy = today.getFullYear(),
        hours = today.getHours(),
        minutes = today.getMinutes();

    console.log("time " + minutes);

    if(minutes < 30){
        // 30분보다 작으면 한시간 전 값
        hours = hours - 1;
        if(hours < 0){
            // 자정 이전은 전날로 계산
            today.setDate(today.getDate() - 1);
            dd = today.getDate();
            mm = today.getMonth()+1;
            yyyy = today.getFullYear();
            hours = 23;
        }
    }
    if(hours<10) {
        hours='0'+hours
    }
    if(mm<10) {
        mm='0'+mm
    }
    if(dd<10) {
        dd='0'+dd
    }

    var _nx = nx,
        _ny = ny,
        apikey = CONFIG.Weather.Key,
        date = yyyy+""+mm+""+dd,
        basetime = hours + "00",
        url = CONFIG.Weather.URL;

    url += "?ServiceKey=" + apikey;
    url += "&base_date=" + date;
    url += "&base_time=" + basetime;
    url += "&nx=" + _nx + "&ny=" + _ny;
    url += "&pageNo=1&numOfRows=6";
    url += "&_type=json";
    console.log(url);
    callRequest(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });
}
// xml2jsonCurrentWth