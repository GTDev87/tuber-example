'use strict';

var tuberDeploy = require("tuber-deploy");
var tuberClient = require("tuber-client");

var privLocation = process.env.HOME + "/work/tuber/tmp/priv.pem";

var machine1Location = {ip: "159.203.88.103", port: 8440};
var machine2Location = {ip: "104.236.220.59", port: 8441};

tuberDeploy.genericBuildAndCreate(machine1Location, __dirname + "/servers/server_1", null, privLocation, {hello: "world"}, function (server1MacaroonSerialized) {
  console.log("server1MacaroonSerialized = %j", server1MacaroonSerialized);
  tuberDeploy.genericBuildAndCreate(machine2Location, __dirname + "/servers/server_2", null, privLocation, {foo: "bar"}, function (server2MacaroonSerialized) {
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