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

const modelExport = () => {
  try {
    return model('Match', schema);
  } catch (err) {
    return model('Match');
  }
};
export const Match = modelExport();

/**
 * @typedef {typeof Match.schema.obj} MatchModel
 */
