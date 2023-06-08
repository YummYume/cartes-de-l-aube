import fastify from 'fastify';
import { Schema, model } from 'mongoose';

const tokenValidator = {
  /**
   * @param {string} tk
   * @returns {Promise<boolean>}
   */
  async validator(tk) {
    const { err } = await fastify.jwt.verify(tk);
    return !err;
  },
  message: 'Invalid token',
};

/**
 * @class RefreshToken
 */
const schema = new Schema({
  refreshTk: {
    type: String,
    validator: tokenValidator,
    required: [true, 'Refresh token is required'],
  },
  tk: {
    type: String,
    validator: tokenValidator,
    required: [true, 'Token is required'],
  },
  user: {
    type: Number,
    required: [true, 'User id is required'],
  },
  createdAt: { type: Date, default: Date.now },
});

export const RefreshToken = model('RefreshToken', schema);
