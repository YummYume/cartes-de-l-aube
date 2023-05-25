FROM node:current-alpine3.17

WORKDIR /home/node/api

COPY ./scripts/api.sh /home/node/scripts/
COPY ./api ./

RUN yarn install

CMD [ "yarn", "start" ]
