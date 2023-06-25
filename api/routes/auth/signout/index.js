import { env } from '../../../config/config.js';
import { RefreshToken } from '../../../mongoose/models/RefreshToken.js';

/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', async (request, reply) => {
    try {
      const oldToken = request.cookies[env.cookie.name];

      if (oldToken) {
        await RefreshToken.deleteOne({ tk: oldToken });
      }

      reply
        .clearCookie(env.cookie.name, env.cookie.config)
        .code(200)
        .send({ message: 'disconected' });
    } catch (err) {
      reply.code(404).send({ message: 'No user logged in.' });
    }
  });
};
