# build environment

FROM node:latest as build-stage

ARG SLACK_CHANNEL
ENV SLACK_CHANNEL=$SLACK_CHANNEL
ARG SLACK_TOKEN
ENV SLACK_TOKEN=$SLACK_TOKEN

COPY . /app

WORKDIR /app

RUN yarn install
RUN yarn build

# production environment

FROM nginx

COPY --from=build-stage /app/target /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 3000