import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class LeapTest {

    public static final DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss,SSS");

    public static void main(String args[]) throws Exception {
        long last = System.currentTimeMillis();
        long start = System.nanoTime();
        long s15InNanos = TimeUnit.NANOSECONDS.convert(15, TimeUnit.SECONDS);
        boolean leapEncountered = false;
        long beforeS = System.nanoTime();
        do {
            long afterS = System.nanoTime();
            long i = System.currentTimeMillis();
            long elapsedSinceLast = TimeUnit.MILLISECONDS.convert(afterS - beforeS, TimeUnit.NANOSECONDS);
            System.out.printf("(+%-4dms) System.currentTimeMillis(): %s, new Date(): %s%n", elapsedSinceLast, i, df.format(new Date()));
            if (i < last) {
                System.out.printf("currentTimeMillis() (%s) is less than last (%s), leap second must have been encountered.%n", i, last);
                leapEncountered = true;
            }
            last = i;
            beforeS = System.nanoTime();
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

