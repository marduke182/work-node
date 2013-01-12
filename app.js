
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, request= require('request')
var clc = require('cli-color');
var ejs = require('ejs');

var model = require("./src/model/");
var controllers = require("./src/controller/");

ejs.open = '{{';
ejs.close = '}}';

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue.bold;



var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
//    app.use(express.cookieDecoder());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(function(err, req, res, next){
      // if an error occurs Connect will pass it down
      // through these "error-handling" middleware
      // allowing you to respond however you like
       console.log(err);
        res.send("fuck my dick");
    })
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

    
controllers.controllers(app,model);

http.createServer(app).listen(app.get('port'), function(){
    console.log(notice("Express server listening on port " + app.get('port')));
});
