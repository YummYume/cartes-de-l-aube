import { afterAll, beforeAll, expect, test } from 'vitest';

import { build, teardown } from '../../appBuild.js';
import { apiInject } from '../../utils/index.js';

const url = '/auth/signin';

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

  await app.inject({
    method: 'POST',
    url: '/auth/signup',
    payload: {
      username: 'test',
      password: 'Password123',
      confirmPassword: 'Password123',
    },
  });

  api = apiInject(app);
});

afterAll(async () => {
  await teardown(app);
});

test(`[${url}]: empty payload`, async () => {
  const res = await api.post(url, {});

  const { statusCode, error } = JSON.parse(res.body);

  expect({ statusCode, error }).toStrictEqual({
    error: 'Unprocessable Entity',
    statusCode: 422,
  });
});

test(`[${url}]: wrong credentials`, async () => {
  const res = await api.post(url, { username: 'test', password: 'bob' });

  const { statusCode, error } = JSON.parse(res.body);

  expect({ statusCode, error }).toStrictEqual({
    error: 'Unauthorized',
    statusCode: 401,
  });
});

test(`[${url}]: good credentials`, async () => {
  const res = await api.post(url, { username: 'test', password: 'Password123' });

  expect(JSON.parse(res.body)).toStrictEqual({
    id: 1,
    image: 'image',
    username: 'test',
    orundum: 12000,
    rankingPoints: 0,
    deck: [],
    operators: [],
    role: 'admin',
  });
});
