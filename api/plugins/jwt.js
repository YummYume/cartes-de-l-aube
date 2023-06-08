import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

import { env } from '../config/config.js';
import { RefreshToken } from '../mongoose/models/RefreshToken.js';

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

  // Middleware to check current token and use refresh token
  fastify.decorate('tokenVerify', async (request, reply) => {
    try {
      await request.jwtVerify({ onlyCookie: true });
    } catch (err) {
      // Check if the current token is expired
      if (err.code === JWT_ERRORS_CODE.AuthorizationTokenExpiredError) {
        const oldToken = request.cookies[env.cookie.name];
        const { id } = await fastify.jwt.decode(oldToken);

        // Get refresh token associate to the current token and the current user
        const oldRefreshToken = await RefreshToken.findOne({ tk: oldToken, user: id }).exec();

        if (!oldRefreshToken) {
          reply.code(401).send({ message: 'Session expired, you need to signin' });
        } else {
          try {
            // Create a new token and refresh token and delete the old one
            await fastify.jwt.verify(oldRefreshToken.refreshTk);

            const tk = await reply.jwtSign({ id }, { expiresIn: '15min' });
            const newRefreshTk = await reply.jwtSign({ id }, { expiresIn: '7d' });

            await RefreshToken.create({ refreshTk: newRefreshTk, tk, user: id });
            await RefreshToken.deleteOne({ tk: oldToken });

            reply.setCookie(env.cookie.name, tk, env.cookie.config);
          } catch (err) {
            reply.code(401).send({ message: 'Session expired, you need to signin' });
          }
        }
      } else {
        reply.send(err);
      }
    }
  });
});
