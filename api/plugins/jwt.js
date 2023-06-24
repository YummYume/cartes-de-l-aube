import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

import { env } from '../config/config.js';
import { RefreshToken } from '../mongoose/models/RefreshToken.js';
import { User } from '../typeorm/models/User.js';

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

  /**
   * @typedef {import("../app").Request} Request
   * @typedef {import("../app").Reply} Reply
   */
  // Middleware to check current token and use refresh token
  fastify.decorate(
    'tokenVerify',
    async (/** @type {Request} */ request, /** @type {Reply} */ reply) => {
      /**
       * @typedef {typeof import('typeorm').Repository<User>} Repository
       * @typedef {typeof import('../typeorm/repositories/UserRepository.js').default} CustomRepository
       * @typedef {Repository & CustomRepository} UserRepository
       * @type {{ userRepository: UserRepository }}
       */
      const { userRepository } = fastify.typeorm;

      try {
        const { id } = await request.jwtVerify({ onlyCookie: true });
        const { password, ...user } = await userRepository.getUser(id);
        request._user = user;
      } catch (err) {
        // Check if the current token is expired
        if (err.code === JWT_ERRORS_CODE.AuthorizationTokenExpiredError) {
          /** @type {string} */
          const oldToken = request.cookies[env.cookie.name];

          /** @type {{id: number}} */
          const { id } = await fastify.jwt.decode(oldToken);

          // Get refresh token associate to the current token and the current user
          const oldRefreshToken = await RefreshToken.findOne({ tk: oldToken, user: id }).exec();

          if (!oldRefreshToken) {
            reply.code(401).send({ message: 'Session expired, you need to sign in' });
          } else {
            try {
              // Create a new token and refresh token and delete the old one
              await fastify.jwt.verify(oldRefreshToken.refreshTk);

              const tk = await reply.jwtSign({ id }, { expiresIn: env.tokenExpireIn });
              const newRefreshTk = await reply.jwtSign(
                { id },
                { expiresIn: env.refreshTokenExpireIn }
              );

              await RefreshToken.create({ refreshTk: newRefreshTk, tk, user: id });
              await RefreshToken.deleteOne({ tk: oldToken });

              // Add current user in request to be accessible in next controller
              try {
                const { password, ...user } = await userRepository.getUser(id);

                if (user) {
                  request._user = user;
                  reply.setCookie(env.cookie.name, tk, env.cookie.config);
                } else {
                  reply.code(404).send({ message: 'User not found' });
                }
              } catch (err) {
                reply.send(err);
              }
            } catch (err) {
              reply.code(401).send({ message: 'Session expired, you need to sign in' });
            }
          }
        } else if (err.code === JWT_ERRORS_CODE.NoAuthorizationInCookieError) {
          reply.code(404).send({ message: 'No Session, please sign up' });
        } else {
          reply.send(err);
        }
      }
    }
  );
});
