import { getRandomRarities, getRefundForDuplicate, getCostForPulls } from '../../lib/rarity.js';
import { Operator } from '../../mongoose/models/Operator.js';

/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['count'],
        properties: {
          count: {
            type: 'number',
          },
        },
      },
    },
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
      const { count } = request.body;

      if (count !== 1 && count !== 10) {
        return fastify.httpErrors.notAcceptable('Pameter "count" must either be 1 or 10.');
      }

      const cost = getCostForPulls(count);

      if (request.user.orundum < cost) {
        return fastify.httpErrors.notAcceptable(
          `Not enough orundum for ${count} pulls. Missing ${cost - request.user.orundum} orundum.`
        );
      }

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
       * @type {import('../../mongoose/models/Operator').OperatorModel[]} operators
       */
      let operators = [];

      for (const rarity of sortedRarities) {
        const operatorsForRarity = await Operator.aggregate([
          { $match: { rarity: rarity.stars } },
          { $sample: { size: rarity.count } },
        ]).exec();

        operators = [...operators, ...operatorsForRarity];
      }

      /**
       * @type {string[]} newOperators
       */
      const newOperators = [];
      let refund = 0;

      operators = operators.map((operator) => {
        const operatorOwned =
          request.user.operators.includes(operator.name) || newOperators.includes(operator.name);
        let operatorRefund = 0;

        if (!operatorOwned) {
          newOperators.push(operator.name);
        } else {
          operatorRefund = getRefundForDuplicate(operator.rarity);
          refund += operatorRefund;
        }

        return {
          operator,
          new: !operatorOwned,
          orundum: operatorRefund,
        };
      });

      /**
       * @type {{userRepository: UserRepository}}
       */
      const { userRepository } = fastify.typeorm;
      const orundumTotal = request.user.orundum - (cost - refund);

      await userRepository.update(
        { id: request.user.id },
        {
          orundum: orundumTotal,
          operators: [...request.user.operators, ...newOperators],
        }
      );

      return {
        operators: operators.sort(() => Math.random() - 0.5),
        orundum: orundumTotal,
      };
    },
  });
};
