import fp from 'fastify-plugin';
import mongoose from 'mongoose';

import { mongodb } from '../config/config.js';

/**
 * @param {Fastify} fastify
 */
export default fp(async (fastify) => {
  try {
    mongoose.connection.on('connected', () => {
      fastify.log.info('MongoDB: Connected');
    });
    mongoose.connection.on('disconnected', () => {
      fastify.log.info('MongoDB: Disconnected');
    });

    await mongoose.connect(
      `${mongodb.type}://${mongodb.host}:${mongodb.port}/${mongodb.database}`,
      {
        authSource: 'admin',
        user: mongodb.username,
        pass: mongodb.password,
      }
    );

    fastify.decorate('mongoose', mongoose.connection);

    fastify.addHook('onClose', async () => {
      await mongoose.disconnect();
    });
  } catch (err) {
    fastify.log.error('MongoDB: Error', err);
  }
});
