var connect = require('connect');
var http = require('http');
var compression = require('compression');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

function start(router) {
    var app = connect()
        .use(compression())
        .use(cookieSession({
            keys: ['secret1', 'secret2']
        }))
        .use(bodyParser.urlencoded())
        .use(router);

    http.createServer(app).listen(process.env.PORT);


}

exports.start = start;




