# build environment

FROM node:latest as build-stage

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN yarn install --silent

COPY . /app

RUN yarn build

# production environment

FROM nginx

COPY --from=build-stage /app /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]