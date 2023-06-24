import fp from 'fastify-plugin';
import { DataSource } from 'typeorm';

import { readdir } from 'fs/promises';
import path from 'path';

import { typeorm } from '../config/config.js';

/**
 * @param {Fastify} fastify
 */
export default fp(async (fastify) => {
  const dataSource = new DataSource(typeorm);
  const repositoriesPath = path.resolve('typeorm/repositories');

  try {
    await dataSource.initialize();

    fastify.log.info('MariaDB: Connected');

    // Add dataSource instance and add repositories from entities
    const { entities } = dataSource.options;

    // Get all custom repository
    const repositories = await [...(await readdir(repositoriesPath))].reduce(async (acc, curr) => {
      const module = await import(path.join(repositoriesPath, curr));
      return { ...acc, [path.parse(curr).name]: module.default };
    }, {});

    fastify.decorate('typeorm', {
      ...dataSource,
      ...entities.reduce(
        (acc, { options: curr }) => ({
          ...acc,
          [`${curr.name[0].toLowerCase() + curr.name.slice(1)}Repository`]:
            dataSource
            .getRepository(curr.target)
            .extend(repositories[`${curr.name}Repository`] ?? {}),
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
