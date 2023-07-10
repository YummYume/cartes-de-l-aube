import autoload from '@fastify/autoload';
import fastify from 'fastify';
import fp from 'fastify-plugin';

import { resolve } from 'path';

import { dropDatabase } from '../typeorm/data-source.js';

const options = {
  test: true,
};

const register = fp(async (fastify, opts) => {
  fastify.register(autoload, {
    dir: resolve('plugins'),
    options: opts,
  });

  fastify.register(autoload, {
    dir: resolve('routes'),
    options: opts,
  });
});

/**
 * @returns {Fastify} app
 * @description Build the app with the plugins and routes
 */
export async function build() {
  const app = fastify(options);

  await app.register(register);

  return app;
}

/**
 * @param {Fastify} app
 * @description Unmount the app, drop the database and close the connection
 */
export async function teardown(app) {
  if (process.env.NODE_ENV === 'test') {
    await dropDatabase(app);
    await app.mongoose.dropDatabase();
  }

  await app.close();
}
