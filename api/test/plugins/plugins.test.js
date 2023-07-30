import Fastify from 'fastify';
import { Schema, model } from 'mongoose';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import mongoose from '../../plugins/mongoose.js';

describe('Standalone plugins', () => {
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

  test('mongoose works standalone', async () => {
    app.register(mongoose);

    await app.ready();

    const Test = model('Test', new Schema({ name: String }));

    const test = await Test.create({ name: 'test' });

    expect(test).toHaveProperty('name', 'test');
  });
});
