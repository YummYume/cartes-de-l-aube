/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (
      /** @type {CustomRequest} request */ request,
      /** @type {ReplyFastify} reply */ reply
    ) => {
      return reply.code(200).send(request.user);
    },
  });
};
