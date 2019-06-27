FROM node:latest as build-stage

WORKDIR /app

COPY ./target /app/

COPY ./nginx.conf /app/

EXPOSE 3000

# NGINX
FROM nginx

COPY --from=build-stage /app /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
