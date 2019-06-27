<<<<<<< HEAD
FROM node:latest

RUN apt-get update && apt-get install xsel

WORKDIR /app

COPY ./ /app

EXPOSE 3000

RUN chmod +x /app/run.sh && yarn install

ENTRYPOINT ["/app/run.sh"]
=======
FROM node:latest as build-stage

WORKDIR /app

COPY ./target /app/

COPY ./nginx.conf /app/

EXPOSE 3000

# NGINX
FROM nginx

COPY --from=build-stage /app /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
>>>>>>> 3599bcefa6296a10ec1d068dbd63822c8e8d406f
