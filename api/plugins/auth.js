import fastifyAuth from '@fastify/auth';
import fp from 'fastify-plugin';

/**
 * @param {import("../app").Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(fastifyAuth);
});
