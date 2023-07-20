import { getConcernedOperatorsForPlayer } from '../../lib/player.js';

/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
      const { operators, squad } = await getConcernedOperatorsForPlayer(request.user);

      return {
        squad,
        availableOperators: operators,
      };
    },
  });

  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['squad'],
        properties: {
          squad: {
            type: 'array',
          },
        },
      },
    },
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
      /**
       * @type {{squad: string[]}}
       */
      const { squad } = request.body;
      /**
       * @type {string[]}
       */
      const squadOperators = [];

      squad.forEach((operator) => {
        if (typeof operator !== 'string') {
          throw fastify.httpErrors.badRequest(
            'Paramter "squad" must contain only operators names.'
          );
        } else if (!request.user.operators.includes(operator)) {
          throw fastify.httpErrors.badRequest(
            `Operator "${operator}" is not available for this player.`
          );
        }

        if (!squadOperators.includes(operator)) {
          squadOperators.push(operator);
        }
      });

      /**
       * @type {{userRepository: UserRepository}}
       */
      const { userRepository } = fastify.typeorm;

      request.user = await userRepository.save({ ...request.user, deck: squadOperators });

      const { operators, squad: playerSquad } = await getConcernedOperatorsForPlayer(request.user);

      return {
        squad: playerSquad,
        availableOperators: operators,
      };
    },
  });
};
