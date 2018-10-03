FROM node:10.8.0-alpine
WORKDIR /usr/src/app

RUN yarn config set strict-ssl false

COPY . ./
RUN yarn && yarn build


ENTRYPOINT ["node", "./dist/index.js"]