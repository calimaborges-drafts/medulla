FROM node:10.8.0-alpine
WORKDIR /usr/src/app

COPY . ./
RUN yarn && yarn build

ENTRYPOINT ["node dist/index.js"]
