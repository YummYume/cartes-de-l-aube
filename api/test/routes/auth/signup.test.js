import { afterAll, beforeAll, expect, test } from 'vitest';

import { userSignupValidation } from '../../../typeorm/schema/UserSchema.js';
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

  api = apiInject(app);

  await api.post(url, {
    username: 'test',
    password: 'Password123',
    confirmPassword: 'Password123',
  });
});

afterAll(async () => {
  await teardown(app);
});

test(`[${url}]: empty payload`, async () => {
  const res = await api.post(url, {});

  const { error } = userSignupValidation({});

  expect(JSON.parse(res.body)).toStrictEqual({ errors: error.issues });
});

test(`[${url}]: user already exist`, async () => {
  const res = await api.post(url, {
    username: 'test',
    password: '123passworD',
    confirmPassword: '123passworD',
  });

  expect(JSON.parse(res.body)).toStrictEqual({
    message: 'Username already taken, please choose another one.',
  });
});
