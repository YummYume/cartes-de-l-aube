/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    handler: async () => {
      /**
       * @type {{ userRepository: UserRepository }}
       */
      const { userRepository } = fastify.typeorm;

      const users = await userRepository.find({
        order: { rankingPoints: 'DESC', username: 'ASC' },
      });

      return {
        users,
      };
    },
  });
};
