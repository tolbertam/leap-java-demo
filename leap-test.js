'use strict';
var sprintf = require('sprintf').sprintf;
var cassandra = require('cassandra-driver');
var MonotonicTimestampGenerator = cassandra.policies.timestampGeneration.MonotonicTimestampGenerator;
var generator = new MonotonicTimestampGenerator(900, 1000);
var client = {
  log: function (level, message) {
    console.log(level, message);
  }
};

var start = process.hrtime();

function elapsed(start) {
  var diff = process.hrtime(start);

  return (diff[0] * 1e9 + diff[1]) / 1000000;
}

var last = process.hrtime();

var interval = setInterval(function() {
  var next = generator.next(client);
  var ms = parseInt(next / 1000);
  var us = next % 1000;
  var d = new Date(ms).toISOString();
  console.log(sprintf('(%.02fms): %d = %s.%03d', elapsed(last), next, d, us));
  last = process.hrtime();
  if(elapsed(start) > 15000) {
      console.log("Done");
      clearInterval(interval);
  }
}, 50);

