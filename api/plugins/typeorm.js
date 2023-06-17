import fp from 'fastify-plugin';
import { DataSource } from 'typeorm';

import { typeorm } from '../config/config.js';

/**
 * @param {import("../app").Fastify} fastify
 */
export default fp(async (fastify) => {
  const dataSource = new DataSource(typeorm);

  try {
    await dataSource.initialize();

    fastify.log.info('MariaDB: Connected');

    // Add dataSource instance and add repositories from entities
    const { entities } = dataSource.options;
    fastify.decorate('typeorm', {
      ...dataSource,
      ...entities.reduce(
        (acc, { options: curr }) => ({
          ...acc,
          [`${curr.name.toLowerCase()}Repository`]: dataSource.getRepository(curr.target),
        }),
        {}
      ),
    });

    fastify.addHook('onClose', async (fastify) => {
      if (fastify.typeorm) {
        if (fastify.typeorm instanceof DataSource) {
          await fastify.typeorm.destroy();
          fastify.log.info('MariaDB: Disconnected');
        }
      }
    });
  } catch (e) {
    fastify.log.error('MariaDB: Error', e.message);
  }
});
