import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { getStoreItems } from '../../../lib/store';
import { addGlobalHeaders, api, defaultCredentials, resetGlobalHeaders } from '../../utils';

describe('Store endpoint', () => {
  const url = '/store';

  /**
   * @type {string} id
   */
  let id;

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

  test(`[${url}]: create a payment`, async () => {
    const item = getStoreItems().at(-1);
    const res = await api.post(url, { orderTypeId: item.orderTypeId });
    const body = await res.json();

    id = body.id;

    expect(id).toBeDefined();
    expect(body.clientSecret).toBeDefined();
  });

  test(`[${url}]: create a payment with an invalid orderTypeId`, async () => {
    const res = await api.post(url, { orderTypeId: 999 });
    const body = await res.json();

    expect(body).toStrictEqual({
      error: 'Not Acceptable',
      message: 'Order type 999 does not exist.',
      statusCode: 406,
    });
  });

  test(`[${url}]: delete a payment`, async () => {
    const res = await api.delete(url, { paymentId: id });

    expect(res.status).toBe(200);
  });
});
