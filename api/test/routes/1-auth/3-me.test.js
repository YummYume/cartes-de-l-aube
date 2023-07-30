import { afterAll, beforeAll, expect, test } from 'vitest';

import { build, teardown } from '../../appBuild.js';
import { apiInject } from '../../utils/index.js';

const url = '/auth/me';

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

  const res = await app.inject({
    method: 'POST',
    url: '/auth/signup',
    payload: {
      username: 'test',
      password: 'Password123',
      confirmPassword: 'Password123',
    },
  });

  api = apiInject(app, { cookie: res.headers['set-cookie'] });
});

afterAll(async () => {
  await teardown(app);
});

test(`[${url}]: without a token`, async () => {
  const res = await api.get(url, { cookie: '' });

  const { statusCode, error } = JSON.parse(res.body);

  expect({ statusCode, error }).toStrictEqual({
    error: 'Not Found',
    statusCode: 404,
  });
});

test(`[${url}]: with a token`, async () => {
  const res = await api.get(url);

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
