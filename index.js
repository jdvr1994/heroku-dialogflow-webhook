"use strict";
var socket = require('socket.io-client')('http://209.182.218.174:8080');
const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

//---------WebSocket Events-------------

socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('event', function(data){});
socket.on('disconnect', function(){});

//------------ REST Service -----------------

restService.post("/echo", function(req, res) {
  //------------- DialogFlow Response -----------
  var speech =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";

  //-------------- Socket Emit to VPS Server ------------
  var message = {
    author: 'dialogflow Heroku',
    modo: 0
  };
  socket.emit('light-mode', message)

  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
