'use strict';
/*jslint nomen: true, vars: true*/
var bunyan = require('bunyan');
var path = require('path');
var log = bunyan.createLogger({
    name: 'yasewang' ,
    streams: [
        {
            level: 'info',
            path: __dirname + '/log/info.log'  // log
        },
        {
            level: 'error',
            path: __dirname + '/log/error.log'  // log ERROR and above to a file
        }
    ]
});

module.exports = log;
