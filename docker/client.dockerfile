FROM node:16.13.1-alpine3.14 AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY ./public ./public
COPY ./src ./src
COPY ./cornucopiaCards ./cornucopiaCards
RUN npm ci
RUN npm run build:client

FROM nginxinc/nginx-unprivileged:1.20.1-alpine
COPY docker/files/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/files/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/
EXPOSE 8080
