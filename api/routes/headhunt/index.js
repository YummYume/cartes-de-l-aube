import { getRandomRarities } from '../../lib/rarity.js';
import { Operator } from '../../mongoose/models/Operator.js';

/**
 * @param {import("../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', {
    handler: async (request) => {
      // TODO verify user here

      const count = Math.max(Math.min(Math.floor(request.body?.count || 1), 10), 1);
      const rarities = getRandomRarities(count);
      /**
       * @type {{stars: number, count: number}[]} sortedRarities
       */
      const sortedRarities = rarities.reduce((prev, current) => {
        const starEntry = prev.find((entry) => entry.stars === current);

        if (starEntry) {
          return [...prev, { stars: current.stars, count: starEntry.count + 1 }];
        }

        return [...prev, { stars: current.stars, count: 1 }];
      }, []);
      /**
       * @type {import('../../mongoose/models/Operator').Operator[]} operators
       */
      let operators = [];

      for (const rarity of sortedRarities) {
        const operatorsForRarity = await Operator.aggregate([
          { $match: { rarity: rarity.stars } },
          { $sample: { size: rarity.count } },
        ]).exec();

        operators = [...operators, ...operatorsForRarity];
      }

      // TODO take orundum from user depending on count and save operators to db

      return {
        operators: operators.sort(() => Math.random() - 0.5),
        orundum: 0,
      };
    },
  });
};
