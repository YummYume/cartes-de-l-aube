import { describe, expect, it } from 'vitest';

import { getExample } from '@/api/example';

describe('Example endpoint', () => {
  it('Responds properly', async () => {
    /**
     * @type {import('@/api/example/index').Example} example
     */
    const example = await getExample();

    expect('Hi example!', example.message);
  });
});
