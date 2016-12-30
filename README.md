# leap-java-demo

This Docker image that demonstrates the behavior of the JDK's time functions
during a leap second.

It is pretty basic, but can be tweaked for experimenting and understanding
the behavior of your application during a leap second.

## How to use this image

To run the demonstration, simply execute:

```
docker run --privileged tolbertam/leap-java-demo
```

Note that `--privileged` is required to be able to update the clock using the
`adjtimex` call, which is employed by the [leap-a-day.c][leap-a-day] script.

## What this does

This image is meant to show that java relies on the OS system clock to get the
current time.  During a leap second, the OS will set it's system clock back 1
second.

John Stultz's [leap-a-day.c][leap-a-day] test is executed in the background to
set the time to 10 seconds before midnight on the current day and injects a
leap second at midnight.

A [local version](/leap-a-day.c#L188-L190) of this test is provided with the
only change being that it is set up to flush to stdout/stderr immediately.

[LeapTest.java](/LeapTest.java) is then executed, which records the result
of Instant.now() every 200ms.  If Instant.now() is ever less than the previous
invocation the program logs this occurrence.  The program exits after 15
seconds with a return code of 0:

```
Setting clock and injecting leap second 10 seconds from now.
Setting time to speed up testing
Running for 1 iterations. Press ctrl-c to stop

Setting time to Sat Dec 31 23:59:50 2016
Scheduling leap second for Sun Jan  1 00:00:00 2017
Setting timer for 1483228800 -  Sun Jan  1 00:00:00 2017
Instant.now(): 2016-12-31T23:59:50.091Z
Instant.now(): 2016-12-31T23:59:50.390Z
...
Instant.now(): 2016-12-31T23:59:59.139Z
Instant.now(): 2016-12-31T23:59:59.343Z
Sat Dec 31 23:59:59 2016 + 515090 us (24)   TIME_INS
Instant.now(): 2016-12-31T23:59:59.545Z
Instant.now(): 2016-12-31T23:59:59.751Z
Instant.now(): 2016-12-31T23:59:59.953Z
Sat Dec 31 23:59:59 2016 +  16964 us (25)   TIME_OOP
Instant.now(): 2016-12-31T23:59:59.155Z
now() (2016-12-31T23:59:59.155Z) is less than last (2016-12-31T23:59:59.953Z), leap second must have been encountered. <--
Instant.now(): 2016-12-31T23:59:59.361Z
Sat Dec 31 23:59:59 2016 + 521955 us (25)   TIME_OOP
Instant.now(): 2016-12-31T23:59:59.563Z
Instant.now(): 2016-12-31T23:59:59.764Z
Instant.now(): 2016-12-31T23:59:59.966Z
...
Leap complete

Instant.now(): 2017-01-01T00:00:03.215Z
Instant.now(): 2017-01-01T00:00:03.418Z
Instant.now(): 2017-01-01T00:00:03.619Z
Instant.now(): 2017-01-01T00:00:03.821Z
Instant.now(): 2017-01-01T00:00:04.023Z
(PASS) Leap second was encountered!
```

If Instant.now() is ever increasing, the program runs for 15 seconds and then exits with a return code of 1:

```
...
Instant.now(): 2017-01-02T00:00:03.427Z
Instant.now(): 2017-01-02T00:00:03.630Z
Instant.now(): 2017-01-02T00:00:03.835Z
Instant.now(): 2017-01-02T00:00:04.037Z
(FAIL) Time was not sent back, must not have encountered a leap second?
```

[leap-a-day]: https://github.com/johnstultz-work/timetests/blob/master/leap-a-day.c
