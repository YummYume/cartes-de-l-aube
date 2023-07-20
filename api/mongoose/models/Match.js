import { Schema, model } from 'mongoose';

export const MatchStatusEnum = {
  WAITING: 'waiting',
  RUNNING: 'running',
  FINISHED: 'finished',
  PAUSE: 'pause',
  CANCELLED: 'cancelled',
};

const playerSchema = {
  id: { type: Number, required: true },
  username: { type: String, required: true },
  picture: { type: String, required: false },
  deck: { type: Array, default: [], required: true },
  hand: { type: Array, default: [], required: true },
};

const battlefieldSchema = {
  firstPlayer: { type: Array, required: true },
  secondPlayer: { type: Array, required: true },
};

/**
 * @class Match
 */
const schema = new Schema({
  startedAt: { type: Date, required: true },
  timer: { type: Number, default: 20 * 60 * 60, required: true },
  status: {
    type: [String],
    enum: Object.values(MatchStatusEnum),
    default: MatchStatusEnum.WAITING,
    required: true,
  },
  players: {
    type: Map,
    of: playerSchema,
  },
  numberTurn: { type: Number, required: true },
  nextTurn: { type: Number, required: true },
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
