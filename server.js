var connect = require('connect');
var http = require('http');
var compression = require('compression');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

function start(router) {
    var port = 9000;
    var app = connect()
        .use(compression())
        .use(cookieSession({
            keys: ['secret1', 'secret2']
        }))
        .use(bodyParser.urlencoded())
        .use(router);

    http.createServer(app).listen(port);
    console.log("Server start at " + port + " port.");
}

exports.start = start;