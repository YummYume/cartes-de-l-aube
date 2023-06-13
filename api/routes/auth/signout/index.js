import { env } from '../../../config/config.js';

/**
 * @param {import("../../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', async (request, reply) => {
    try {
      await request.jwtVerify({ onlyCookie: true });
      reply
        .clearCookie(env.cookie.name, env.cookie.config)
        .code(200)
        .send({ message: 'disconected' });
    } catch (err) {
      reply.code(404).send({ message: 'No user logged in.' });
    }
  });
};
