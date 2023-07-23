import { EntitySchema } from 'typeorm';
import { z } from 'zod';

import { MatchHistory } from '../models/MatchHistory.js';

export default new EntitySchema({
  name: 'MatchHistory',
  target: MatchHistory,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    startedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    endedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    players: {
      target: 'MatchHistoryPlayer',
      type: 'one-to-many',
      mappedBy: 'matchHistory',
    },
  },
});

/**
 * @param {import('../models/MatchHistory.js').MatchHistory} matchHistory
 * @returns {import('../models/MatchHistory.js').MatchHistory}
 */
export const matchHistoryValidation = (matchHistory) => {
  return z
    .object({
      startedAt: z.date(),
      endedAt: z.date(),
      players: z.array(z.object()).length(2, { message: 'Match must have 2 players.' }),
    })
    .safeParse(matchHistory);
};
