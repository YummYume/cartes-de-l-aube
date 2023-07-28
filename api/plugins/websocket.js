import fastifyWS from '@fastify/websocket';
import fp from 'fastify-plugin';

/**
 * @param {Fastify} fastify
 */
export default fp(async (fastify) => {
  fastify.register(fastifyWS);
});
