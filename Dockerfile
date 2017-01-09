FROM node:latest
RUN apt-get update
RUN apt-get install -y build-essential ntp
ADD leap-a-day.c /
RUN gcc -lrt leap-a-day.c -o leap-a-day
ENV NODE_PATH=/usr/local/lib/node_modules
RUN npm install -g sprintf
ADD leap-test.js /
ADD leap_demo.sh /
ENTRYPOINT ["/leap_demo.sh"]
