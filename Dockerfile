FROM node:latest

RUN apt-get update && apt-get install xsel

WORKDIR /app

COPY ./ /app

RUN chmod +x /app/run && yarn install

EXPOSE 3000

ENTRYPOINT ["/app/run"]