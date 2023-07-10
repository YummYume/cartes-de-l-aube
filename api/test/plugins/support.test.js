import Fastify from 'fastify';
import { afterEach, beforeEach, expect, test } from 'vitest';

import Support from '../../plugins/support.js';

/**
 * @type {Fastify}
 */
let app;

beforeEach(() => {
  app = Fastify();
});

afterEach(async () => {
  await app.close();
});

test('support works standalone', async () => {
  app.register(Support);

  await app.ready();

  expect(app.someSupport()).toStrictEqual('hugs');
});

// You can also use plugin with opts in fastify v2
//
// test('support works standalone', (t) => {
//   t.plan(2)
//   const fastify = Fastify()
//   fastify.register(Support)
//
//   fastify.ready((err) => {
//     t.error(err)
//     t.equal(fastify.someSupport(), 'hugs')
//   })
// })
