import formbody from '@fastify/formbody';
import fp from 'fastify-plugin';

/**
 * @param {Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(formbody);
});
