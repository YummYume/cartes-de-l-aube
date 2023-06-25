import multipart from '@fastify/multipart';
import fp from 'fastify-plugin';

/**
 * @param {Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(multipart);
});
