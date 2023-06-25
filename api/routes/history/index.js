/**
 * @param {import("../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    handler: async () => {
      /**
       * @type {{matchHistoryRepository: import('typeorm').Repository<import('../../typeorm/models/MatchHistory')>}}}
       */
      const { matchHistoryRepository } = fastify.typeorm;
      // TODO get user match histories
      const matches = await matchHistoryRepository.find();

      return {
        matches,
      };
    },
  });
};
