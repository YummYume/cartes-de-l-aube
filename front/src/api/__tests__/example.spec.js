import { describe, expect, it } from 'vitest';

import { getExample } from '@/api/example';

describe('Example endpoint', () => {
  it('Responds properly', async () => {
    const res = await getExample();
    /** @type {{ message: string }} */
    const json = await res.json();

    expect('Hi example!', json.message);
  });
});
