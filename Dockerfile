# client build
FROM node:latest as build
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn build

# server build
FROM node:alpine

# Installs latest Chromium (73) package.
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge=~73.0.3683.103 \
      nss@edge \
      freetype@edge \
      freetype-dev@edge \
      harfbuzz@edge \
      ttf-freefont@edge

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN mkdir -p /usr/src/app/server/targe
COPY --from=build /app/target /usr/src/app/server/target

WORKDIR /usr/src/app
ADD ./server ./server

WORKDIR /usr/src/app/server
RUN yarn install --production=true

EXPOSE 3000

## Environment variable setup
ARG SLACK_CHANNEL
ARG SLACK_TOKEN
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG NODE_ENV
ARG SOAESB_LOGIN_USERNAME
ARG SOAESB_LOGIN_PASSWORD
ENV SLACK_CHANNEL=$SLACK_CHANNEL \
    SLACK_TOKEN=$SLACK_TOKEN \
    GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID \
    GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET \
    NODE_ENV=$NODE_ENV \
    SOAESB_LOGIN_USERNAME=$SOAESB_LOGIN_USERNAME \
    SOAESB_LOGIN_PASSWORD=$SOAESB_LOGIN_PASSWORD

CMD [ "node", "server.js"]