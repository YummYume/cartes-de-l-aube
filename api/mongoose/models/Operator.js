import { Schema, model } from 'mongoose';

/**
 * @class Operator
 */
const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rarity: {
    type: Number,
    required: true,
  },
  alter: {
    type: String,
  },
  description: {
    type: String,
  },
  statistics: {
    base: {
      hp: Number,
      atk: Number,
      def: Number,
    },
  },
  art: [
    {
      name: String,
      link: String,
    },
  ],
});

export const Operator = model('Operator', schema);
