FROM node:16.13.1-alpine3.14 AS builder
ARG REACT_APP_EOP_IMPRINT
ARG REACT_APP_EOP_PRIVACY
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY ./public ./public
COPY ./cornucopiaCards ./cornucopiaCards
COPY ./.eslintignore ./.eslintignore
COPY ./.eslintrc.cjs ./.eslintrc.cjs
COPY ./.prettierignore ./.prettierignore
COPY ./.prettierrc.cjs ./.prettierc.cjs
COPY ./src ./src
ENV REACT_APP_EOP_IMPRINT=$REACT_APP_EOP_IMPRINT
ENV REACT_APP_EOP_PRIVACY=$REACT_APP_EOP_PRIVACY
RUN npm run build:client

FROM nginxinc/nginx-unprivileged:1.20.1-alpine
COPY docker/files/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/files/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/
EXPOSE 8080
