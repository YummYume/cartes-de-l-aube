import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { api, defaultCredentials, resetGlobalHeaders, addGlobalHeaders } from '../../utils';

describe('Squad endpoint', () => {
  const url = '/squad';

  /**
   * @type {import('../../typeorm/entities/user').User}
   */
  let user;

  beforeAll(async () => {
    const res = await api.post('/auth/signin', {
      username: defaultCredentials.username,
      password: defaultCredentials.password,
    });

    addGlobalHeaders({ cookie: res.headers.getSetCookie().join(';') });

    user = await (await api.get('/auth/me')).json();
  });

  afterAll(async () => {
    resetGlobalHeaders();
  });

  test(`[${url}]: with an invalid payload`, async () => {
    const res = await api.post(url, { invalid: 'invalid' });
    const body = await res.json();

    expect(body).toStrictEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: "body must have required property 'squad'",
      statusCode: 400,
    });
  });

  test(`[${url}]: with no selected operator`, async () => {
    const res = await api.post(url, { squad: [] });
    const { squad, availableOperators } = await res.json();

    expect(squad).toHaveLength(0);
    expect(availableOperators).toHaveLength(user.operators.length);
  });

  test(`[${url}]: with a an array of object`, async () => {
    const res = await api.post(url, { squad: [{ name: 'operator-name' }] });
    const body = await res.json();

    expect(body).toStrictEqual({
      error: 'Bad Request',
      message: 'Paramter "squad" must contain only operators names.',
      statusCode: 400,
    });
  });

  test(`[${url}]: with an operator not existed`, async () => {
    const res = await api.post(url, { squad: ['operator-name'] });
    const body = await res.json();

    expect(body).toStrictEqual({
      error: 'Bad Request',
      message: 'Operator "operator-name" is not available for this player.',
      statusCode: 400,
    });
  });

  test(`[${url}]: selected an operator`, async () => {
    const res = await api.post(url, { squad: user.operators.slice(0, 1) });
    const { squad, availableOperators } = await res.json();

    expect(squad).toHaveLength(1);
    expect(availableOperators).toHaveLength(user.operators.length - 1);
  });
});
