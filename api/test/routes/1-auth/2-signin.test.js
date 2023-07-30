import { describe, expect, test } from 'vitest';

import { api, defaultCredentials } from '../../utils';

describe('Auth signin endpoint', () => {
  const url = '/auth/signin';

  test(`[${url}]: empty payload`, async () => {
    const res = await api.post(url, {});
    const { statusCode, error } = await res.json();

    expect({ statusCode, error }).toStrictEqual({
      error: 'Unprocessable Entity',
      statusCode: 422,
    });
  });

  test(`[${url}]: wrong credentials`, async () => {
    const res = await api.post(url, { username: 'test', password: 'bob' });
    const { statusCode, error } = await res.json();

    expect({ statusCode, error }).toStrictEqual({
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  test(`[${url}]: good credentials`, async () => {
    const res = await api.post(url, {
      username: defaultCredentials.username,
      password: defaultCredentials.password,
    });
    const body = await res.json();

    expect(body).toContain({
      id: 1,
      image: 'image',
      username: 'test',
      role: 'admin',
    });
  });
});
