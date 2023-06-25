/**
 * @param {import('../../app').Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', { logLevel: 'warn' }, async () => {
    return {
      uptime: process.uptime(),
      status: 'healthy',
      date: Date.now(),
    };
  });
};
