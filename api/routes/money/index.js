/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
      if (!request.body.count) {
        return fastify.httpErrors.notAcceptable('Missing count parameter.');
      }

      const count = Math.max(Math.min(Math.floor(request.body.count), 1000000), 1);
      /**
       * @type {{userRepository: UserRepository}}}
       */
      const { userRepository } = fastify.typeorm;
      const newOrundum = request.user.orundum + count;

      await userRepository.update(request.user.id, {
        orundum: newOrundum,
      });

      return {
        orundum: newOrundum,
      };
    },
  });
};
