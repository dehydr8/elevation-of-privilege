FROM node:15.14.0-alpine3.13 AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --only=production

FROM node:15.14.0-alpine3.13
RUN apk add dumb-init
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
USER node
ENV NODE_ENV production
COPY --chown=node:node  --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node ./src/server /usr/src/app/src/server
COPY --chown=node:node ./src/game /usr/src/app/src/game
COPY --chown=node:node ./src/utils /usr/src/app/src/utils
CMD [ "dumb-init", "node", "-r", "esm", "/usr/src/app/src/server/server.js" ]

