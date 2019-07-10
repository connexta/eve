# build environment

FROM node:latest as build-stage

## Environment variable setup
ARG SLACK_CHANNEL
ARG SLACK_TOKEN
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ENV SLACK_CHANNEL=$SLACK_CHANNEL \
    SLACK_TOKEN=$SLACK_TOKEN \
    GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID \
    GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET

COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn build

# production environment

FROM nginx
COPY --from=build-stage /app/target /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 3000