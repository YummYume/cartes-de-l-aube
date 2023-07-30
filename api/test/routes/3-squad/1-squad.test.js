import { afterAll, beforeAll, expect, test } from 'vitest';

import { build, teardown } from '../../appBuild.js';
import { apiInject } from '../../utils/index.js';

const url = '/squad';

/**
 * @type {Fastify}
 */
let app;

/**
 * @type {ReturnType<typeof apiInject>}
 */
let api;

/**
 * @type {import('../../typeorm/entities/user').User}
 */
let user;

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

  await api.post('/headhunt', { count: 10 });
  user = JSON.parse((await api.get('/auth/me')).body);
});

afterAll(async () => {
  await teardown(app);
});

test(`[${url}]: without a payload`, async () => {
  const res = await api.post(url, {});

  expect(JSON.parse(res.body)).toStrictEqual({
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: "body must have required property 'squad'",
    statusCode: 400,
  });
});

test(`[${url}]: with no selected operator`, async () => {
  const res = await api.post(url, { squad: [] });

  const { squad, availableOperators } = JSON.parse(res.body);

  expect(squad).toHaveLength(0);
  expect(availableOperators).toHaveLength(10);
});

test(`[${url}]: with a an array of object`, async () => {
  const res = await api.post(url, { squad: [{ name: 'operator-name' }] });

  expect(JSON.parse(res.body)).toStrictEqual({
    error: 'Bad Request',
    message: 'Paramter "squad" must contain only operators names.',
    statusCode: 400,
  });
});

test(`[${url}]: with an operator not existed`, async () => {
  const res = await api.post(url, { squad: ['operator-name'] });

  expect(JSON.parse(res.body)).toStrictEqual({
    error: 'Bad Request',
    message: 'Operator "operator-name" is not available for this player.',
    statusCode: 400,
  });
});

test(`[${url}]: selected an operator`, async () => {
  const res = await api.post(url, { squad: user.operators.slice(0, 4) });

  const { squad, availableOperators } = JSON.parse(res.body);

  expect(squad).toHaveLength(4);
  expect(availableOperators).toHaveLength(6);
});
