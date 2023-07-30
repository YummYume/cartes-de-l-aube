import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addGlobalHeaders, api, defaultCredentials, resetGlobalHeaders } from '../../utils';

describe('Admin user endpoint', () => {
  const url = '/admin/user';

  /**
   * @type {number} nonAdminId
   */
  let nonAdminId;

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

  test(`[${url}]: get the users as a non-admin`, async () => {
    const signupRes = await api.post('/auth/signup', {
      username: 'testNonAdmin',
      password: 'ThisIsATest123',
      confirmPassword: 'ThisIsATest123',
    });
    const signupBody = await signupRes.json();
    const res = await api.get(url, { cookie: signupRes.headers.getSetCookie().join(';') });
    const body = await res.json();

    nonAdminId = signupBody.id;

    expect(body).toStrictEqual({
      error: 'Unauthorized',
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  test(`[${url}]: get the users as an admin`, async () => {
    const res = await api.get(url);
    const body = await res.json();

    expect(body.users).toHaveLength(3);
  });

  test(`[${url}]: promote a user to admin`, async () => {
    const res = await api.patch(`${url}/${nonAdminId}`, { role: 'admin' });
    const body = await res.json();

    expect(body).toContain({
      id: nonAdminId,
      role: 'admin',
    });
  });
});
