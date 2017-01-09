'use strict';
var sprintf = require('sprintf').sprintf;
var cassandra = require('cassandra-driver');
var MonotonicTimestampGenerator = cassandra.policies.timestampGeneration.MonotonicTimestampGenerator;
var generator = new MonotonicTimestampGenerator(800, 1000);

// Whether or not the micros part of the timestamp was incremented, indicates clock skew.
var incrementedMicros = false;
// Whether or not a log entry was emitted, indictes clock skew.
var loggedSkew = false;

var client = {
  log: function (level, message) {
    loggedSkew = true;
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
  if(us > 0) {
    incrementedMicros = true;
  }
  var d = new Date(ms).toISOString();
  console.log(sprintf('(%.02fms): %d = %s.%03d', elapsed(last), next, d, us));
  last = process.hrtime();
  if (elapsed(start) > 15000) {
    clearInterval(interval);
    if (incrementedMicros && loggedSkew) {
      console.log('MonotonicTimestampGenerator encountered clock skew properly!');
      process.exit(0);
    } else {
      console.error(sprintf('MonotonicTimestampGenerator failed to detect and/or account for clock skew properly! incrementedMicros=%s, loggedSkew=%s.', incrementedMicros, loggedSkew));
      process.exit(-1);
    }
  }
}, 50);

