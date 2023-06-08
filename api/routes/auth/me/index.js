/**
 * @param {import("../../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    preHandler: fastify.auth([fastify.tokenVerify]),
    handler: async () => {
      return { message: 'verify' };
    },
  });
};
