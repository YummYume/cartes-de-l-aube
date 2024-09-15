FROM node:20-alpine3.17 as BUILD

ARG VITE_STRIPE_PUBLIC_KEY
ARG VITE_API_HOST
ARG VITE_WS_HOST

WORKDIR /home/node/front

COPY ./front ./

RUN yarn install --frozen-lockfile && yarn build

FROM nginx:stable-alpine3.17-slim

WORKDIR /usr/share/nginx

COPY ./docker/prod/front/nginx.conf /etc/nginx/nginx.conf

COPY --from=BUILD /home/node/front/dist ./app/
