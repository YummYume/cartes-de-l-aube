import { Schema, model } from 'mongoose';

export const MatchStatusEnum = {
  WAITING: 'waiting',
  RUNNING: 'running',
  FINISHED: 'finished',
  PAUSE: 'pause',
  CANCELLED: 'cancelled',
};

const playerSchema = new Schema(
  {
    id: { type: Number, required: true },
    username: { type: String, required: true },
    picture: { type: String, required: false },
    energy: { type: Number, default: 2, min: 0, max: 10, required: true },
    deck: { type: Array, default: [], required: true },
    hand: { type: Array, default: [], required: true },
  },
  { _id: false }
);

const operatorSchema = new Schema(
  {
    name: { type: String, required: true },
    statistics: {
      hp: { type: Number, required: true },
      atk: { type: Number, required: true },
      def: { type: Number, required: true },
      cost: { type: Number, required: true },
    },
  },
  { _id: false }
);

const cardFieldSchema = {
  type: Map,
  of: new Schema(
    {
      operator: operatorSchema,
      position: { type: Number, min: 0, max: 3, required: true },
    },
    { _id: false }
  ),
  default: [],
};

/**
 * @class Match
 */
const schema = new Schema({
  startedAt: { type: Date, default: new Date(), required: true },
  timer: { type: Number, default: 20 * 60 * 60, required: true },
  status: {
    type: String,
    enum: Object.values(MatchStatusEnum),
    default: MatchStatusEnum.WAITING,
    required: true,
  },
  players: {
    type: Map,
    of: playerSchema,
  },
  battlefield: {
    type: Map,
    of: cardFieldSchema,
    default: [],
  },
  totalTurn: { type: Number, default: 0, required: true },
  playerTurn: { type: Number, required: true },
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
