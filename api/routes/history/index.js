/**
 * @param {import("../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (
      /** @type {CustomRequest} request */ request,
      /** @type {ReplyFastify} reply */ reply
    ) => {
      /**
       * @type {{matchHistoryPlayerRepository: import('typeorm').Repository<import('../../typeorm/models/MatchHistoryPlayer')>}}}
       */
      const { matchHistoryPlayerRepository } = fastify.typeorm;

      try {
        const matches = await matchHistoryPlayerRepository.find({
          where: {
            user: {
              id: request.user.id,
            },
          },
          relations: {
            matchHistory: true,
          },
        });

        if (matches) {
          reply.code(200).send(matches);
        }
      } catch (err) {
        reply.code(500).send({ message: 'Error when fetching matches history' });
      }
    },
  });
};
