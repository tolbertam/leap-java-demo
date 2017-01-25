# leap-java-demo

This Docker image that demonstrates the behavior of the JDK's time functions during a leap second.

It is pretty basic, but can be tweaked for experimenting and understanding the behavior of your application during a leap second.

## How to use this image

To run the demonstration, simply execute:

```
docker run --rm --privileged tolbertam/leap-java-demo
```

Note that `--privileged` is required to be able to update the clock using the `adjtimex` call, which is employed by the [leap-a-day.c][leap-a-day] script.

Also note that if you are running Docker in an environment where the kernel is shared with your host system (i.e. Linux) this will change the clock in your host environment, beware!

## What this does

This image is meant to show that java relies on the OS system clock to get the current time.  During a leap second, the OS will set it's system clock back 1 second.

John Stultz's [leap-a-day.c][leap-a-day] test is executed in the background to set the time to 10 seconds before midnight on the current day and injects a leap second at midnight.

A [local version](/leap-a-day.c#L188-L190) of this test is provided with the only change being that it is set up to flush to stdout/stderr immediately.

[LeapTest.java](/LeapTest.java) is then executed, which records the result of Instant.now() every 200ms.  If Instant.now() is ever less than the previous invocation the program logs this occurrence.  The program exits after 15 seconds with a return code of 0:

```sh
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

Note that the behavior is such that the system clock change is observed by the JDK, however older versions of the JDK may demonstrate different behaviors, for example if you try this same experiment with JDK 6:

```
docker run --rm --privileged tolbertam/leap-java-demo:6-jdk
```

You should observe that during the leap second the elapsed duration (derived from System.nanoTime()) between time checks takes 1200ms instead of 200ms.  This is because of scheduling and timing operations (such as `Thread.sleep`) previously used CLOCK\_REALTIME instead of CLOCK\_MONOTONIC.  This is no longer the case as of JDK 7u60.

```sh
(+205 ms) System.currentTimeMillis(): 1483315199458, new Date(): 2017-01-01 23:59:59,458
Sun Jan  1 23:59:59 2017 + 512804 us (35)    TIME_INS
(+204 ms) System.currentTimeMillis(): 1483315199663, new Date(): 2017-01-01 23:59:59,663
(+203 ms) System.currentTimeMillis(): 1483315199867, new Date(): 2017-01-01 23:59:59,867
Sun Jan  1 23:59:59 2017 +  13815 us (36)    TIME_OOP
Sun Jan  1 23:59:59 2017 + 517398 us (36)    TIME_OOP
Mon Jan  2 00:00:00 2017 +   1661 us (36)    TIME_WAIT
(+1200ms) System.currentTimeMillis(): 1483315200068, new Date(): 2017-01-02 00:00:00,068
```

For more information on that, see: http://mail.openjdk.java.net/pipermail/hotspot-runtime-dev/2015-April/014775.html

[leap-a-day]: https://github.com/johnstultz-work/timetests/blob/master/leap-a-day.c
