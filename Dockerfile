FROM ubuntu:latest
WORKDIR /usr/src/app
ENV PORT 80

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get update && apt-get install -y nginx supervisor nodejs
RUN rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install
COPY . .
COPY conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY conf/nginx.conf /etc/nginx/sites-available/default

RUN npm run build
RUN cp -a build/. /var/www/html/

# add support for $PORT env variable
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/sites-available/default && /usr/bin/supervisord