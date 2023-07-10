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

test(`[${url}]: wrong credentials`, async () => {
  const res = await api.post(url, { username: 'test', password: 'bob' });

  expect(JSON.parse(res.body)).toStrictEqual({ message: 'Invalid credentials' });
});

test(`[${url}]: good credentials`, async () => {
  const res = await api.post(url, { username: 'test', password: 'Password123' });

  expect(JSON.parse(res.body)).toStrictEqual({
    id: 1,
    image: 'image',
    username: 'test',
    orundum: 12000,
    deck: [],
  });
});
