import Fastify from 'fastify';
import { Schema, model } from 'mongoose';
import { afterEach, beforeEach, expect, test } from 'vitest';

import mongoose from '../../plugins/mongoose.js';
import { apiInject } from '../utils/index.js';

/**
 * @type {Fastify}
 */
let app;

/**
 * @type {ReturnType<typeof apiInject>}
 */
let api;

beforeEach(() => {
  app = Fastify();
  api = apiInject(app);
});

afterEach(async () => {
  await app.close();
});

// test('auth works standalone', async () => {
//   app.register(auth);

//   app.get('/auth-test', {
//     onRequest: app.auth([
//       async (request) => {
//         request.user = { username: 'test' };
//       },
//     ]),
//     handler: async (request, reply) => {
//       return reply.code(200).send(request.user);
//     },
//   });

//   await app.ready();

//   const res = await api.get('/auth-test');

//   expect(JSON.parse(res.body)).toBe({ username: 'test' });
// });

test('mongoose works standalone', async () => {
  app.register(mongoose);

  await app.ready();

  const Test = model('Test', new Schema({ name: String }));

  const test = await Test.create({ name: 'test' });

  expect(test).toHaveProperty('name', 'test');
});
