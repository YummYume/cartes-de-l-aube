/**
 * @param {import("../../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    preHandler: fastify.auth([fastify.tokenVerify]),
    handler: async (request, reply) => {
      if (request.user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      return reply.code(200).send(request.user);
    },
  });
};
