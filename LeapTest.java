import java.time.Instant;
import java.util.concurrent.TimeUnit;

public class LeapTest {

    public static void main(String args[]) throws Exception {
        Instant last = Instant.now();
        long start = System.nanoTime();
        long s15InNanos = TimeUnit.NANOSECONDS.convert(15, TimeUnit.SECONDS);
        boolean leapEncountered = false;
        do {
            Instant i = Instant.now();
            System.out.printf("Instant.now(): %s%n", i);
            if (i.isBefore(last)) {
                System.out.printf("now() (%s) is less than last (%s), leap second must have been encountered.%n", i, last);
                leapEncountered = true;
            }
            last = i;
            Thread.sleep(200);
        } while (System.nanoTime() - start < s15InNanos);

        if(leapEncountered) {
            System.out.println("(PASS) Leap second was encountered!");
        } else {
            System.err.println("(FAIL) Time was not sent back, must not have encountered a leap second?");
            System.exit(1);
        }
    }
}

