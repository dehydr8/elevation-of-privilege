FROM node:17.0.1-alpine3.14 AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --only=production

FROM node:17.0.1-alpine3.14
RUN apk add dumb-init
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
USER node
ENV NODE_ENV production
RUN mkdir -p /usr/src/app/db-images
COPY --chown=node:node  --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node ./src/server /usr/src/app/src/server
COPY --chown=node:node ./src/game /usr/src/app/src/game
COPY --chown=node:node ./src/utils /usr/src/app/src/utils
CMD [ "dumb-init", "node", "--unhandled-rejections=warn", "-r", "esm", "/usr/src/app/src/server/server.js" ]
