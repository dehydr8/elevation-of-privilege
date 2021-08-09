FROM node:16.6.1-alpine3.14 AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY ./public ./public
COPY ./src ./src
COPY ./cornucopiaCards ./cornucopiaCards
RUN npm ci
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.18-alpine
COPY docker/files/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/
EXPOSE 8080
