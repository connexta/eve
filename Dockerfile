# client build
FROM node:latest as build

ARG SLACK_CHANNEL
ARG SLACK_TOKEN
ARG GITHUB_TOKEN
ENV SLACK_CHANNEL=$SLACK_CHANNEL \
    SLACK_TOKEN=$SLACK_TOKEN \
    GITHUB_TOKEN=$GITHUB_TOKEN

COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn build

# server build
FROM alpine:edge

# Installs latest Chromium (76) package.
# Puppeteer v1.17.0 works with Chromium 76.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn 

# Help prevent zombie chrome processes
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN mkdir -p /usr/src/app/server/target
COPY --from=build /app/target /usr/src/app/server/target

RUN mkdir -p /eve
COPY --from=build /app/eve /eve

WORKDIR /usr/src/app
ADD ./server ./server

WORKDIR /usr/src/app/server
RUN yarn install --production=true

# Puppeteer v1.17.0 works with Chromium 76.
RUN yarn add puppeteer@1.17.0

ARG NODE_ENV
ARG SOAESB_LOGIN_USERNAME
ARG SOAESB_LOGIN_PASSWORD
ENV NODE_ENV=$NODE_ENV \
    SOAESB_LOGIN_USERNAME=$SOAESB_LOGIN_USERNAME \
    SOAESB_LOGIN_PASSWORD=$SOAESB_LOGIN_PASSWORD

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD [ "node", "server.js"]
