FROM ubuntu:latest
WORKDIR /usr/src/app
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

EXPOSE 80
CMD ["/usr/bin/supervisord"]