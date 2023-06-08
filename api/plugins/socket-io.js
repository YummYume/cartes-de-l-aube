import fp from 'fastify-plugin';
import fastifyIO from 'fastify-socket.io';

/**
 * @param {import("../app").Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(fastifyIO, {
    cors: {
      origin: new RegExp(process.env.CORS_ALLOW_ORIGIN),
    },
  });
});
