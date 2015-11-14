'use strict';

var tuberMacstack = require("tuber-macstack");
var tuberClient = require("tuber-client");

var privLocation = process.env.HOME + "/work/tuber/tmp/priv.pem";

var machine1Location = {ip: "159.203.88.103", port: 8460};
var machine2Location = {ip: "104.236.220.59", port: 8461};

function server1Controller (macstackApp){
  macstackApp.addRoute("/", function (req, res, data){
    res.json({data: data});
  });
  macstackApp.run();
}

function server2Controller (macstackApp){
  macstackApp.addRoute("/", function (req, res, data){
    // var tuberClient = require("tuber-client");

    // tuberClient.createConnection(privLocation, data.mac, data.mach1Loc, function (err, response, body) {
      res.json({data: data, foo: data.foo + " ALSO HELLO WORLD!!!!"});
    // });
  });

  macstackApp.run();
}

// console.log(server2Controller.toString());

tuberMacstack.deployController(machine1Location, null, privLocation, {hello: "world"}, server1Controller, function (server1MacaroonSerialized) {

  var nextData = {foo: "bar", mach1Loc: machine1Location, mac: server1MacaroonSerialized};
  //when passing macaroon "server1MacaroonSerialized"
  
  //need to finish adding the request portion
  //use "privLocation" private key to "finish" the macaroon
  
  //add 3rd party caveat using certificate from machine2
  //question how do i get certificate from machine 2???????

  tuberMacstack.deployController(machine2Location, null, privLocation, nextData, server2Controller, function (server2MacaroonSerialized) {
    tuberClient.createConnection(privLocation, server1MacaroonSerialized, machine1Location, function (err, response, body) {
      console.log("machine 1 err = %j", err);
      console.log("machine 1 response = %j", response);
      console.log("machine 1 body = %j", body);
      tuberClient.createConnection(privLocation, server2MacaroonSerialized, machine2Location, function (err, response, body) {
        console.log("machine 2 err = %j", err);
        console.log("machine 2 response = %j", response);
        console.log("machine 2 body = %j", body);
      });
    });
  });
});