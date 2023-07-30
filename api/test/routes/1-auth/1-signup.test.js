import { afterAll, beforeAll, expect, test } from 'vitest';

import { cmd } from '../../../lib/utils.js';
import { build, teardown } from '../../appBuild.js';
import { apiInject } from '../../utils/index.js';

const url = '/auth/signup';

/**
 * @type {Fastify}
 */
let app;

/**
 * @type {ReturnType<typeof apiInject>}
 */
let api;

beforeAll(async () => {
  app = await build();
  await app.ready();

  await cmd('node', './commands/sync-operators.js');

  api = apiInject(app);
});

afterAll(async () => {
  await teardown(app);
});

test(`[${url}]: signup a new user`, async () => {
  const res = await api.post(url, {
    username: 'test',
    password: 'Password123',
    confirmPassword: 'Password123',
  });

  expect(JSON.parse(res.body)).toStrictEqual({
    id: 1,
    username: 'test',
    orundum: 12000,
    image: 'image',
    deck: [],
    operators: [],
    rankingPoints: 0,
    role: 'admin',
  });
});

test(`[${url}]: empty payload`, async () => {
  const res = await api.post(url, {});

  const { statusCode, error } = JSON.parse(res.body);

  expect({ statusCode, error }).toStrictEqual({
    error: 'Unprocessable Entity',
    statusCode: 422,
  });
});

test(`[${url}]: user already exist`, async () => {
  const res = await api.post(url, {
    username: 'test',
    password: '123passworD',
    confirmPassword: '123passworD',
  });

  expect(JSON.parse(res.body)).toStrictEqual({
    error: 'Conflict',
    message: 'Username already taken, please choose another one.',
    statusCode: 409,
  });
});
