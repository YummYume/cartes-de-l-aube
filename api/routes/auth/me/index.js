import { User } from '../../../typeorm/models/User.js';

/**
 * @param {import("../../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    preHandler: fastify.auth([fastify.tokenVerify]),
    handler: async (request, reply) => {
      if (request.userId) {
        return reply.code(404).send({ message: 'User not found' });
      }

      /**
       * @type {{userRepository: import('typeorm').Repository<User>}}}
       */
      const { userRepository } = fastify.typeorm;

      const user = await userRepository.findOne({
        select: {
          password: false,
          id: false,
        },
        where: {
          id: request.userId,
        },
      });

      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      return reply.code(200).send(user);
    },
  });
};
