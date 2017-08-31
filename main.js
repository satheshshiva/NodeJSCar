#!/usr/bin/env node
'use strict';

var WEBSERVER_PORT		= 8080;
var WEBSOCKET_PORT		= 8081;
var PRIVATE_DIR			= "client/private";
var express = require('express');
var app = express();
var ws = require("nodejs-websocket");

(function(){
    initRouting();
    startWebServer();
    startWebSocket();

})();

function initRouting(){

    //location of static files like css, js,  etc.,
    app.use(express.static('client/public'));

    //routing
    app.get('/', function (req, res) {
        res.sendFile( PRIVATE_DIR + "/html/index.html", { root: __dirname });
    })
}

function startWebServer(){
    app.listen(WEBSERVER_PORT, function () {
        console.log( 'Website running on port:' + WEBSERVER_PORT)
    });
}

function startWebSocket(){

    var server = ws.createServer(function (conn) {
        console.log("New connection");
        conn.on("text", function (str) {
            if(str === "hi"){
                conn.sendText("Hi");
            }

            console.log("Received "+str);
        });
        conn.on("close", function (code, reason) {
            console.log("Connection closed");
        });
        conn.on("error", function (code) {
            console.log("Connection Error:" + code);
        });
    }).listen(WEBSOCKET_PORT);

    console.log( 'WebSocket running on port:' + WEBSOCKET_PORT);
}