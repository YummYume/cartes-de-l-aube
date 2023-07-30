import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { DEFAULT_PULL_COST } from '../../../lib/rarity.js';
import { api, defaultCredentials, resetGlobalHeaders, addGlobalHeaders } from '../../utils';

describe('Headhunt endpoint', () => {
  const url = '/headhunt';

  /**
   * @type {string[]} operators
   */
  let pulledOperators = [];

  let currentOrundum = 0;

  beforeAll(async () => {
    const res = await api.post('/auth/signin', {
      username: defaultCredentials.username,
      password: defaultCredentials.password,
    });
    const { orundum } = await res.json();

    currentOrundum = orundum;

    addGlobalHeaders({ cookie: res.headers.getSetCookie().join(';') });
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
      message: "body must have required property 'count'",
      statusCode: 400,
    });
  });

  test(`[${url}]: with an invalid count`, async () => {
    const res = await api.post(url, { count: 'test' });
    const body = await res.json();

    expect(body).toStrictEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'body/count must be number',
      statusCode: 400,
    });
  });

  test(`[${url}]: with a count not equal 1 or 10`, async () => {
    const res = await api.post(url, { count: 5 });
    const body = await res.json();

    expect(body).toStrictEqual({
      error: 'Not Acceptable',
      message: 'Pameter "count" must either be 1 or 10.',
      statusCode: 406,
    });
  });

  test(`[${url}]: with a count equal 1`, async () => {
    const res = await api.post(url, { count: 1 });
    const { operators, orundum } = await res.json();

    expect(operators).toHaveLength(1);
    expect(orundum).toBe(11400);

    pulledOperators = operators.map((opResult) => opResult.operator.name);
    currentOrundum = orundum;
  });

  test(`[${url}]: with a count equal 10`, async () => {
    const res = await api.post(url, { count: 10 });
    const { operators, orundum } = await res.json();

    operators
      .filter((opResult) => !opResult.new)
      .forEach((opResult) => {
        currentOrundum -= DEFAULT_PULL_COST;

        pulledOperators.push(opResult.operator.name);
        currentOrundum += opResult.orundum;
      });

    operators
      .filter((opResult) => opResult.new)
      .forEach((opResult) => {
        currentOrundum -= DEFAULT_PULL_COST;

        const alreadyPulled = operators.some(
          (op) => op.operator.name === opResult.operator.name && !op.new
        );

        if (alreadyPulled) {
          expect(pulledOperators).toContain(opResult.operator.name);
        } else {
          expect(pulledOperators).not.toContain(opResult.operator.name);
        }

        pulledOperators.push(opResult.operator.name);
        currentOrundum += opResult.orundum;
      });

    expect(operators).toHaveLength(10);
    expect(orundum).toBe(currentOrundum);
  });

  test(`[${url}]: with another 10 pull`, async () => {
    const res = await api.post(url, { count: 10 });
    const body = await res.json();
    const remainingOrundum = currentOrundum - DEFAULT_PULL_COST * 10;

    if (remainingOrundum < 0) {
      expect(body).toStrictEqual({
        error: 'Not Acceptable',
        message: `Not enough orundum for 10 pulls. Missing ${remainingOrundum * -1} orundum.`,
        statusCode: 406,
      });
    } else {
      expect(body.operators).toHaveLength(10);
    }
  });
});
