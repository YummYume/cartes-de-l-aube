import { Operator } from '../mongoose/models/Operator.js';

/**
 * Get the concerned operators for a player
 * @param {User} player
 * @returns {Promise<{ squad: import('../mongoose/models/Operator').OperatorModel[], operators: import('../mongoose/models/Operator').OperatorModel[] }>}
 */
export const getConcernedOperatorsForPlayer = async (player) => {
  const operators = await Operator.find({
    name: player.operators,
  }).exec();

  return {
    squad: operators
      .filter((o) => player.deck.includes(o.name))
      .slice(0, 10)
      .sort((a, b) => {
        const aIndex = player.deck.indexOf(a.name);
        const bIndex = player.deck.indexOf(b.name);

        if (aIndex === bIndex) {
          return 0;
        }

        return aIndex > bIndex ? 1 : -1;
      }),
    operators: operators
      .filter((o) => !player.deck.includes(o.name))
      .sort((a, b) => {
        if (a.rarity === b.rarity) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }

          return 0;
        }

        return b.rarity - a.rarity;
      }),
  };
};
