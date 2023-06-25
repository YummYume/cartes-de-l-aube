import { Schema, model } from 'mongoose';

const playerSchema = {
  username: { type: String, required: true },
  picture: { type: String, required: false },
  operators: { type: Array, required: true },
};

/**
 * @class Match
 */
const schema = new Schema({
  startedAt: { type: Date, required: true },
  firstPlayer: playerSchema,
  secondPlayer: playerSchema,
});

export const Match = model('Match', schema);

/**
 * @typedef {typeof Match.schema.obj} MatchModel
 */
