FROM node:current-alpine3.17

WORKDIR /home/node/front

COPY ./scripts/front.sh /home/node/scripts/
COPY ./front ./

RUN apk add xdg-utils && \
    yarn install

CMD [ "yarn", "dev" ]
