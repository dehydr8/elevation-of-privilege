FROM node:16.13.1-alpine3.14 AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY tsconfig.server.json ./
COPY ./src ./src
RUN npm run build:server

FROM node:16.13.1-alpine3.14 AS dependency-installer
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm ci --only=production

FROM node:16.13.1-alpine3.14
RUN apk add dumb-init
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
USER node
ENV NODE_ENV production
RUN mkdir -p /usr/src/app/db-images
COPY --chown=node:node --from=builder /usr/src/app/build-server /usr/src/app/build-server
COPY --chown=node:node --from=dependency-installer /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node package.json /usr/src/app/
CMD [ "dumb-init", "node", "--unhandled-rejections=warn", "--es-module-specifier-resolution=node", "/usr/src/app/build-server/server/server.js" ]
