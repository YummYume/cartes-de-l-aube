/**
 * @param {import("../../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (request, reply) => {
      return reply.code(200).send(request._user);
    },
  });
};
