import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

import { env } from '../config/config.js';

const JWT_ERRORS_CODE = {
  NoAuthorizationInCookieError: 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE',
  AuthorizationTokenExpiredError: 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED',
  AuthorizationTokenUntrustedError: 'FST_JWT_AUTHORIZATION_TOKEN_UNTRUSTED',
  AuthorizationTokenUnsignedError: 'FAST_JWT_MISSING_SIGNATURE',
  NoAuthorizationInHeaderError: 'FST_JWT_NO_AUTHORIZATION_IN_HEADER',
  AuthorizationTokenInvalidError: 'FST_JWT_AUTHORIZATION_TOKEN_INVALID',
  BadRequestError: 'FST_JWT_BAD_REQUEST',
  BadCookieRequestError: 'FST_JWT_BAD_COOKIE_REQUEST',
};

/**
 * @param {import("../app").Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: env.secretKey,
    cookie: {
      cookieName: env.cookie.name,
    },
  });

  fastify.decorate('tokenVerify', async (request, reply) => {
    try {
      await request.jwtVerify({ onlyCookie: true });
    } catch (err) {
      if (err.code === JWT_ERRORS_CODE.AuthorizationTokenExpiredError) {
        const oldToken = request.cookies[env.cookie.name];
        const { id } = await fastify.jwt.decode(oldToken);
        reply.send();
        // const token = await reply.jwtSign({ id: 'bob2' });
        // reply
        //   .setCookie('token', token, {
        //     domain: 'api.carte.local',
        //     path: '/',
        //     secure: false,
        //     httpOnly: true,
        //     sameSite: true,
        //   })
        //   .code(200)
        //   .send({ message: 'new good' });
      } else {
        reply.send(err);
      }
    }
  });
});


