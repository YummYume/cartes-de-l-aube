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

  expect(JSON.parse(res.body)).toStrictEqual({ message: 'No Session, please sign up' });
});

test(`[${url}]: with a token`, async () => {
  const res = await api.get(url);

  expect(JSON.parse(res.body)).toStrictEqual({
    id: 1,
    image: 'image',
    username: 'test',
    orundum: 12000,
    role: 'admin',
    deck: [],
    operators: [],
  });
});
