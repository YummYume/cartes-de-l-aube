import cors from '@fastify/cors';
import fp from 'fastify-plugin';

/**
 * @param {import("../app").Fastify} fastify
 */
export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: new RegExp(process.env.CORS_ALLOW_ORIGIN),
    credentials: true,
  });
});
