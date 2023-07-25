FROM node:20-alpine3.17 as BUILD

WORKDIR /home/node/front

COPY ./front /home/node/front

RUN yarn install && yarn build

FROM nginxinc/nginx-unprivileged:1.25

COPY ./docker/prod/front/nginx.conf /etc/nginx/nginx.conf
COPY --from=BUILD /home/node/front/dist /usr/share/nginx/app
