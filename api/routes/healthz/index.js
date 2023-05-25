/**
 * @param {import('../../app').Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', async (req, res) => {
    const health = {
      uptime: process.uptime(),
      message: 'Service is healthy.',
      date: Date.now(),
    };

    try {
      return health;
    } catch (_) {
      health.message = 'Service is unhealthy.';

      return res.code(500).send(health);
    }
  });
};
