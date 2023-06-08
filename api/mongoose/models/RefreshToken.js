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
  message: 'Token invalid',
};

/**
 * @class RefreshToken
 */
const schema = new Schema({
  refreshTk: {
    type: String,
    validator: tokenValidator,
    required: [true, 'Refresh token required'],
  },
  tk: {
    type: String,
    validator: tokenValidator,
    required: [true, 'Token required'],
  },
  user: {
    type: Number,
    required: [true, "User id's required"],
  },
  createdAt: { type: Date, default: Date.now },
});

export const RefreshToken = model('RefreshToken', schema);
