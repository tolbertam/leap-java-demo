#! /bin/bash -lex

echo "Installing cassandra-driver from branch NODEJS-322"
npm install -g https://github.com/datastax/nodejs-driver/tarball/NODEJS-322

echo "Setting clock and injecting leap second 10 seconds from now."
# Inject leap second in background and set time 10 seconds before leap second inserted, run for 1 iteration.
./leap-a-day -s -i 1 &

node leap-test.js
