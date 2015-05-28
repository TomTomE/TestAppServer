
var connectRoute = require('connect-route');
var callRequest = require('request');
var parseString = require('xml2js').parseString;

var connectRouter = connectRoute(function(router) {
    router.get('/', function (req, res, next) {
        res.end('index');
    });

    router.get('/home', function (req, res, next) {
        res.end('home');
    });

    router.get('/home/:id', function (req, res, next) {
        callRequest('http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1159068000', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                parseString(body, function (err, result) {
                    console.dir(result);
                    
                    res.end(result.rss.$.version);
                });
            }
        })
        
        
        //res.end('home ' + req.params.id);
    });

    router.post('/home', function (req, res, next) {
        res.end('POST to home');
    });
});

exports.connectRouter = connectRouter;