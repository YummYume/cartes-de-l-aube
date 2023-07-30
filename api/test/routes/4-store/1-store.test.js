import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { getStoreItems } from '../../../lib/store';
import { addGlobalHeaders, api, defaultCredentials, resetGlobalHeaders } from '../../utils';

describe('Store endpoint', () => {
  const url = '/store';

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

  test(`[${url}]: get store items`, async () => {
    const res = await api.get(url);
    const body = await res.json();

    expect(body).toStrictEqual({
      items: getStoreItems(),
    });
  });
});
