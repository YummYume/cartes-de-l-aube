FROM node:20-alpine3.17

WORKDIR /home/node/api

COPY --chown=node:node ./api ./

RUN yarn install --frozen-lockfile

USER node

CMD [ "yarn", "start" ]
