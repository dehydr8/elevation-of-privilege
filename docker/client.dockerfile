FROM node:15.14.0-alpine3.13 AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY ./public ./public
COPY ./src ./src
RUN npm ci
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.18-alpine
COPY docker/files/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/
EXPOSE 8080
