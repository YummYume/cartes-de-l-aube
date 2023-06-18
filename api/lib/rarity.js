/**
 * @typedef {{type: string, stars: number, rarity: number}} Rarity
 */

/**
 * @type {Rarity[]}
 */
const rarities = [
  {
    type: 'common',
    stars: 3,
    rarity: 0.6,
  },
  {
    type: 'rare',
    stars: 4,
    rarity: 0.34,
  },
  {
    type: 'elite',
    stars: 5,
    rarity: 0.05,
  },
  {
    type: 'top',
    stars: 6,
    rarity: 0.01,
  },
];

/**
 * Get all rarities sorted by rarity
 * @returns {Rarity[]}
 */
export const getRarities = () => rarities.sort((a, b) => a.rarity - b.rarity);

/**
 * Get one or more random rarities
 * @param {number} count
 * @returns {Rarity[]}
 */
export const getRandomRarities = (count = 1) => {
  const rarities = getRarities();
  const total = rarities.reduce((a, b) => a + b.rarity, 0);
  const random = (Math.random() * total).toFixed(2);

  return Array(count)
    .fill(rarities.at(-1))
    .map(() => {
      for (let i = 0; i < rarities.length; i += 1) {
        const rarity = rarities[i];

        if (random <= rarity.rarity) {
          return rarity;
        }
      }

      return rarities.at(-1);
    });
};
