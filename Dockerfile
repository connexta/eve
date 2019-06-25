FROM node:latest

RUN apt-get update && apt-get install xsel

WORKDIR /app

COPY ./ /app

EXPOSE 3000

RUN chmod +x /app/run.sh && yarn install

ENTRYPOINT ["/app/run.sh"]