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
    hp: { type: Number, default: 1, min: 0, max: 5, required: true },
    username: { type: String, required: true },
    picture: { type: String, required: false },
    energy: { type: Number, default: 10, min: 0, max: 10, required: true },
    deck: [String],
    gameDeck: [{ type: Schema.Types.ObjectId, ref: 'Operator' }],
  },
  { _id: false }
);

const cardFieldSchema = new Schema(
  {
    operator: { type: Schema.Types.ObjectId, ref: 'Operator' },
    statistics: {
      hp: Number,
      atk: Number,
      def: Number,
      cost: Number,
    },
  },
  { _id: false }
);

/**
 * @class Match
 */
const schema = new Schema({
  startedAt: { type: Date, default: new Date(), required: true },
  players: {
    type: Map,
    of: playerSchema,
  },
  battlefield: {
    type: Map,
    of: [cardFieldSchema],
  },
  totalTurn: { type: Number, default: 0, required: true },
  playerTurn: { type: Number, required: true },
  actionTurn: {
    deploys: { type: [String], default: [], required: true },
    attacks: { type: [{ initiator: String, target: String }], default: [], required: true },
  },
});

// schema.pre('find', async function (next) {
//   try {
//     // Get the 'Match' document being queried
//     const match = this;

//     // Populate the 'player' field to get the referenced 'Player' document
//     await match.populate('player').execPopulate();

//     // Access the 'Player' document from the 'player' field
//     const player = match.player;

//     // Modify the 'score' field in the 'Match' document based on the 'score' field of the 'Player'
//     match.score = player.score * 2; // For example, double the player's score

//     // Proceed to the next step in the middleware chain
//     next();
//   } catch (error) {
//     // Handle the error, if any
//     next(error);
//   }
// });

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
