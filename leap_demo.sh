#! /bin/bash

echo "Setting clock and injecting leap second 10 seconds from now."
# Inject leap second in background and set time 10 seconds before leap second inserted, run for 1 iteration.
./leap-a-day -s -i 1 &

# Run LeapTest which will exit when leap second encountered with rc 0, or -1 if no leap second encountered after 20 seconds.
java LeapTest
