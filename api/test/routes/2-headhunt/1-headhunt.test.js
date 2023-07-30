import { afterAll, beforeAll, expect, test } from 'vitest';

import { build, teardown } from '../../appBuild.js';
import { apiInject } from '../../utils/index.js';

const url = '/headhunt';

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

test(`[${url}]: without a payload`, async () => {
  const res = await api.post(url, {});

  expect(JSON.parse(res.body)).toStrictEqual({
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: "body must have required property 'count'",
    statusCode: 400,
  });
});

test(`[${url}]: with a bad payload`, async () => {
  const res = await api.post(url, { count: 'test' });

  expect(JSON.parse(res.body)).toStrictEqual({
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: 'body/count must be number',
    statusCode: 400,
  });
});

test(`[${url}]: with a count not equal 1 or 10`, async () => {
  const res = await api.post(url, { count: 5 });

  expect(JSON.parse(res.body)).toStrictEqual({
    error: 'Not Acceptable',
    message: 'Pameter "count" must either be 1 or 10.',
    statusCode: 406,
  });
});

test(`[${url}]: with a count equal 1`, async () => {
  const res = await api.post(url, { count: 1 });

  const { operators, orundum } = JSON.parse(res.body);

  expect(operators).toHaveLength(1);
  expect(orundum).toBe(11400);
});

test(`[${url}]: with a count equal 10`, async () => {
  const res = await api.post(url, { count: 10 });

  const { operators, orundum } = JSON.parse(res.body);

  expect(operators).toHaveLength(10);
  expect(orundum).toBe(5400);
});

test(`[${url}]: with not enough orundum`, async () => {
  const res = await api.post(url, { count: 10 });

  expect(JSON.parse(res.body)).toStrictEqual({
    error: 'Not Acceptable',
    message: 'Not enough orundum for 10 pulls. Missing 600 orundum.',
    statusCode: 406,
  });
});
