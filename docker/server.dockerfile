FROM node:16.13.1-alpine3.14 AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.server.json ./
COPY ./src ./src
RUN npm ci
RUN npm run build:server

FROM node:16.13.1-alpine3.14
RUN apk add dumb-init
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
USER node
ENV NODE_ENV production
RUN mkdir -p /usr/src/app/db-images
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --only=production
COPY --chown=node:node --from=builder /usr/src/app/build-server /usr/src/app/build-server
CMD [ "dumb-init", "node", "--unhandled-rejections=warn", "--es-module-specifier-resolution=node", "/usr/src/app/build-server/server/server.js" ]
