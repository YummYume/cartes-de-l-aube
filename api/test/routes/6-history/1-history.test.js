import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addGlobalHeaders, api, defaultCredentials, resetGlobalHeaders } from '../../utils';

describe('History endpoint', () => {
  const url = '/history';

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

  test(`[${url}]: get user history`, async () => {
    const res = await api.get(url);
    const body = await res.json();

    expect(body).toStrictEqual([]);
  });
});
