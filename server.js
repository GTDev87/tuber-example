'use strict';

var tuberDeploy = require("tuber-deploy");
var tuberClient = require("tuber-client");

var privLocation = process.env.HOME + "/work/tuber/tmp/priv.pem";

var machine1Location = {ip: "159.203.88.103", port: 8340};
var machine2Location = {ip: "104.236.220.59", port: 8341};

tuberDeploy.genericBuildAndCreate(machine1Location, __dirname + "/servers/server_1", null, privLocation, {hello: "world"}, function (server1MacaroonSerialized) {
  console.log("server1MacaroonSerialized = %j", server1MacaroonSerialized);
  //HAVING PROBLEMS HERE (below): 
  // Error: write after end
  //   at writeAfterEnd (_stream_writable.js:167:12)
  //   at Socket.Writable.write (_stream_writable.js:214:5)
  //   at Socket.write (net.js:634:40)
  //   at /Users/GT/work/tuber/tuber-example/node_modules/tuber-deploy/lib/index.js:61:22
  //   at /Users/GT/work/tuber/tuber-example/node_modules/tuber-deploy/node_modules/pem/lib/pem.js:334:16
  //   at /Users/GT/work/tuber/tuber-example/node_modules/tuber-deploy/node_modules/pem/lib/pem.js:967:20
  //   at /Users/GT/work/tuber/tuber-example/node_modules/tuber-deploy/node_modules/pem/lib/pem.js:930:13
  //   at done (/Users/GT/work/tuber/tuber-example/node_modules/tuber-deploy/node_modules/pem/lib/pem.js:868:21)
  //   at ChildProcess.<anonymous> (/Users/GT/work/tuber/tuber-example/node_modules/tuber-deploy/node_modules/pem/lib/pem.js:883:13)
  //   at ChildProcess.emit (events.js:110:17)

  //probably not handling streams in tuber-deploy properly
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