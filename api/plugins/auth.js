import fastifyAuth from '@fastify/auth';
import fp from 'fastify-plugin';

/**
 * @param {Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(fastifyAuth, {
    defaultRelation: 'and',
  });

  fastify.decorate(
    'guard',
    async (/** @type {CustomRequest} */ request, /** @type {ReplyFastify} */ reply) => {
      if (request.user?.role !== 'admin') {
        reply.unauthorized();
      }
    }
  );
});
