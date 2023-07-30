import autoload from '@fastify/autoload';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import fastify from 'fastify';
import fp from 'fastify-plugin';
import fs from 'graceful-fs';

import { resolve } from 'path';

import { defaultCredentials } from './utils/index.js';

import { env } from '../config/config.js';
import { getOperators } from '../lib/api.js';
import { Operator } from '../mongoose/models/Operator.js';
import { dropDatabase } from '../typeorm/data-source.js';

const options = {
  test: true,
};

/**
 * @type {Fastify} app
 */
let app;

let teardownHappened = false;

const register = fp(async (fastify, opts) => {
  if (fs.existsSync(resolve('.env'))) {
    config({ path: resolve('.env'), override: true });
  }

  if (fs.existsSync(resolve('.env.local'))) {
    config({ path: resolve('.env.local'), override: true });
  }

  if (fs.existsSync(resolve('.env.test'))) {
    config({ path: resolve('.env.test'), override: true });
  }

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
 * @description Build the app with the plugins and routes
 */
export async function setup() {
  app = fastify(options);

  await app.register(register);

  const operators = await getOperators();

  for (const operator of operators) {
    await Operator.updateOne({ name: operator.name }, operator, { upsert: true });
  }

  await app.listen({ port: 9999 });

  const { userRepository } = app.typeorm;
  const salt = await bcrypt.genSalt(env.saltFactor);

  await userRepository.save({
    username: defaultCredentials.username,
    password: await bcrypt.hash(defaultCredentials.password, salt),
    image: 'image',
    orundum: 12000,
    deck: [],
    role: 'admin',
  });
}

/**
 * @description Unmount the app, drop the database and close the connection
 */
export async function teardown() {
  if (teardownHappened) {
    throw new Error('Test teardown called twice.');
  }

  teardownHappened = true;

  if (process.env.NODE_ENV === 'test') {
    await dropDatabase(app);
    await app.mongoose.dropDatabase();
  }

  await app.close();

  process.exit(0);
}
