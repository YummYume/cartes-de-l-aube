import { describe, expect, test } from 'vitest';

import { api } from '../../utils';

describe('Leaderboard endpoint', () => {
  const url = '/leaderboard';

  test(`[${url}]: get the leaderboard`, async () => {
    const res = await api.get(url);
    const body = await res.json();

    expect(body.users).toHaveLength(2);
  });
});
