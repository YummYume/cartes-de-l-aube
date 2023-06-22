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
    hp: Number,
    atk: Number,
    def: Number,
    cost: Number,
  },
  class: {
    type: String,
    required: true,
  },
  art: [
    {
      name: String,
      link: String,
    },
  ],
});

export const Operator = model('Operator', schema);

/**
 * @typedef {typeof Operator.schema.obj} OperatorModel
 */
