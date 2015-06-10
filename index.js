var server = require("./server");
var router = require("./router");
var base = require('./base');
global.CONFIG = require("./config");

server.start(router.connectRouter);