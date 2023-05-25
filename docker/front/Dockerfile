FROM node:current-alpine3.17

WORKDIR /home/node/front

RUN apk add xdg-utils

COPY ./scripts/front.sh /home/node/scripts/

USER node

ENTRYPOINT [ "/bin/sh", "/home/node/scripts/front.sh" ]
