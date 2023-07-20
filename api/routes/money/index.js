/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['count'],
        properties: {
          count: {
            type: 'number',
          },
        },
      },
    },
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
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
