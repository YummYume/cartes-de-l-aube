/**
 * @typedef {{type: string, stars: number, rarity: number}} Rarity
 */

export const DEFAULT_PULL_COST = 600;

/**
 * @type {Rarity[]}
 */
const rarities = [
  {
    type: 'common',
    stars: 3,
    rarity: 0.6,
    refund: 0.25,
  },
  {
    type: 'rare',
    stars: 4,
    rarity: 0.3,
    refund: 0.5,
  },
  {
    type: 'elite',
    stars: 5,
    rarity: 0.08,
    refund: 0.75,
  },
  {
    type: 'top',
    stars: 6,
    rarity: 0.02,
    refund: 1,
  },
];

/**
 * Get all rarities sorted by rarity
 * @returns {Rarity[]}
 */
export const getRarities = () => rarities.sort((a, b) => a.rarity - b.rarity);

/**
 * Get the orundum cost for one or more pulls
 * @param {number} count
 * @returns {number}
 */
export const getCostForPulls = (count = 1) => count * DEFAULT_PULL_COST;

/**
 * Get one or more random rarities
 * @param {number} count
 * @returns {Rarity[]}
 */
export const getRandomRarities = (count = 1) => {
  const rarities = getRarities();
  const total = rarities.reduce((a, b) => a + b.rarity, 0);

  return Array(count)
    .fill(rarities.at(-1))
    .map(() => {
      const random = (Math.random() * total).toFixed(2);

      for (let i = 0; i < rarities.length; i += 1) {
        const rarity = rarities[i];

        if (random <= rarity.rarity) {
          return rarity;
        }
      }

      return rarities.at(-1);
    });
};

/**
 * Get the refund for a duplicate
 * @param {number} rarity
 * @param {number} amount
 * @returns {number}
 */
export const getRefundForDuplicate = (rarity, amount = DEFAULT_PULL_COST) => {
  const rarityObject = rarities.find((r) => r.stars === rarity);

  if (!rarityObject) {
    return 0;
  }

  return rarityObject.refund * amount;
};
