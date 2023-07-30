import { describe, expect, test } from 'vitest';

import { api } from '../../utils';

describe('Auth signup endpoint', () => {
  const url = '/auth/signup';

  test(`[${url}]: signup a new user`, async () => {
    const res = await api.post(url, {
      username: 'test2',
      password: '123passworD',
      confirmPassword: '123passworD',
    });
    const body = await res.json();

    expect(body).toStrictEqual({
      id: 2,
      username: 'test2',
      orundum: 12000,
      image: 'image',
      deck: [],
      operators: [],
      rankingPoints: 0,
      role: 'user',
    });
  });

  test(`[${url}]: empty payload`, async () => {
    const res = await api.post(url);
    const { statusCode, error } = await res.json();

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
    const body = await res.json();

    expect(body).toStrictEqual({
      error: 'Conflict',
      message: 'Username already taken, please choose another one.',
      statusCode: 409,
    });
  });
});
