FROM alpine:3
WORKDIR /usr/src/app
ENV PORT 80

RUN apk add --no-cache nginx supervisor nodejs npm

COPY package*.json ./
RUN npm install
COPY src ./src
COPY public ./public

RUN npm run build

RUN mkdir -p /run/nginx
COPY heroku/conf/supervisord.conf /etc/supervisord.conf
COPY heroku/conf/nginx.conf /etc/nginx/http.d/default.conf

RUN cp -a build/. /var/www/html/

# add support for $PORT env variable
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/http.d/default.conf && /usr/bin/supervisord