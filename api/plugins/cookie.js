import fastifyCookie from '@fastify/cookie';
import fp from 'fastify-plugin';

import { env } from '../config/config.js';

/**
 * @param {Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(fastifyCookie, {
    secret: env.cookie.secretKey,
  });
});
