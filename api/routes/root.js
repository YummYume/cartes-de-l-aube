/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', async () => {
    return { root: true };
  });
};
