FROM node:16.14.0-buster

MAINTAINER Raja <raja.baskaran@iotium.io>

RUN apt-get update

RUN apt-get install -y libgbm-dev

RUN apt-get install -yq --no-install-recommends libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 libnss3

COPY docker-entrypoint.sh /entrypoint.sh

COPY package.json /package.json

COPY package-lock.json /package-lock.json

RUN chmod +x /entrypoint.sh

RUN npm install

ENTRYPOINT ["/entrypoint.sh"]
