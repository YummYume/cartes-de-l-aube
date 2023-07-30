import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { api, resetGlobalHeaders, defaultCredentials, addGlobalHeaders } from '../../utils';

describe('Auth me endpoint', () => {
  const url = '/auth/me';

  beforeAll(async () => {
    const res = await api.post('/auth/signin', {
      username: defaultCredentials.username,
      password: defaultCredentials.password,
    });

    addGlobalHeaders({ cookie: res.headers.getSetCookie().join(';') });
  });

  afterAll(async () => {
    resetGlobalHeaders();
  });

  test(`[${url}]: without a token`, async () => {
    const res = await api.get(url, { cookie: '' });
    const { statusCode, error } = await res.json();

    expect({ statusCode, error }).toStrictEqual({
      error: 'Not Found',
      statusCode: 404,
    });
  });

  test(`[${url}]: with a token`, async () => {
    const res = await api.get(url);
    const body = await res.json();

    expect(body).toStrictEqual({
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
});
