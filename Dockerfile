# client build
FROM node:latest as build

ARG SLACK_CHANNEL
ARG SLACK_TOKEN
ENV SLACK_CHANNEL=$SLACK_CHANNEL \
    SLACK_TOKEN=$SLACK_TOKEN

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

WORKDIR /usr/src/app
ADD ./server ./server

WORKDIR /usr/src/app/server
RUN yarn install --production=true

# Puppeteer v1.17.0 works with Chromium 76.
RUN yarn add puppeteer@1.17.0

ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG NODE_ENV
ARG SOAESB_BEARER_TOKEN
ENV NODE_ENV=$NODE_ENV \
    SOAESB_BEARER_TOKEN=$SOAESB_BEARER_TOKEN \
    GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID \
    GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET 

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD [ "node", "server.js"]