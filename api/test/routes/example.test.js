import { afterEach, beforeEach, expect, test } from 'vitest';

import { build, teardown } from '../appBuild.js';

/**
 * @type {Fastify}
 */
let app;

beforeEach(async () => {
  app = await build();
});

afterEach(async () => {
  await teardown(app);
});

test('example is loaded', async () => {
  await app.ready();

  const res = await app.inject({
    url: '/example',
  });

  expect(JSON.parse(res.body)).toStrictEqual({ message: 'Hi example!' });
});
