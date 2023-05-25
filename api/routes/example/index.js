/**
 * @param {import("../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', async () => {
    return { message: 'Hi example!' };
  });
};
