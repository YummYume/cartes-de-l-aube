import { EntitySchema } from 'typeorm';
import { z } from 'zod';

import { MatchHistoryPlayer } from '../models/MatchHistoryPlayer.js';

export default new EntitySchema({
  name: 'MatchHistoryPlayer',
  target: MatchHistoryPlayer,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    operators: {
      type: 'simple-array',
      default: '',
    },
    status: {
      type: 'enum',
      enum: ['winner', 'loser', 'abandon'],
    },
    orundum: {
      type: 'int',
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      inversedBy: 'matchHistoryPlayers',
    },
    matchHistory: {
      target: 'MatchHistory',
      type: 'many-to-one',
      inversedBy: 'players',
    },
  },
});

/**
 * @param {import('../models/MatchHistoryPlayer.js').MatchHistoryPlayer} matchHistoryPlayer
 * @returns {import('../models/MatchHistoryPlayer.js').MatchHistoryPlayer}
 */
export const matchHistoryPlayerValidation = (matchHistoryPlayer) => {
  return z
    .object({
      operators: z.array(z.string()),
      status: z.enum(['winner', 'loser', 'abandon']),
      orundum: z.number(),
    })
    .safeParse(matchHistoryPlayer);
};
