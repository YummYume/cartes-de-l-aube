# Les cartes de l'Aube

[![Code linting](https://github.com/YummYume/cartes-de-l-aube/actions/workflows/linting.yml/badge.svg)](https://github.com/YummYume/cartes-de-l-aube/actions/workflows/linting.yml)
[![Code testing](https://github.com/YummYume/cartes-de-l-aube/actions/workflows/testing.yml/badge.svg)](https://github.com/YummYume/cartes-de-l-aube/actions/workflows/testing.yml)

Card game about Arknights made with Vue3 & Fastify.

> **Warning**
> This project is a school project, made for educational purposes only. It is deployed and available online only for demonstration. We are not making any money out of it, and we do not intend to.

This project was made as the final project of our ESGI 4th year. The constraints were to use Vue3 and Fastify.
We could choose between three different project ideas, and we chose the game, because it was the most interesting one.

## Installation (very easy)

Steps to install and run the project locally.

1. Clone the repository
2. Add `carte.local`, `front.carte.local`, `api.carte.local`, `mongodb.carte.local` and `phpmyadmin.carte.local` to your hosts file.
3. (Optional) adjust the `.env` files to your needs by creating `.env.local` files.
4. Run `make start` to start the project (or look into the Makefile to see the different commands available).
5. Go to `front.carte.local` to see the website.

## Running tests

To run the tests, you can use the command `make test-unit-front` to run the unit tests for the front, `make test-unit-api` to run the unit tests for the api.

## Disclaimer

This project is not affiliated with Hypergryph or Yostar in any way. It is a fan-made project, made by fans, for fans (and for our school project too).
Payments were a requirement for the project, but we do not intend to make any money out of it. The payments are only here to test the payment system and are always in test mode (see the [Stripe documentation](https://stripe.com/docs/testing?testing-method=card-numbers#cards)).
