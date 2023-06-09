import fastifyHelmet from '@fastify/helmet';
import fp from 'fastify-plugin';

import { env } from '../config/config.js';

/**
 * @param {import("../app").Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(fastifyHelmet, env.helmet);
});
