import {
  getPercentagePriceSavedForAmount,
  getPullsForAmount,
  DEFAULT_PULL_PRICE,
} from './rarity.js';

/**
 * @typedef {{ orderTypeId: number, price: number, amount: number }} StoreItem
 * @typedef {StoreItem & { pulls: number, savedPercentage: number }} StoreItemWithStats
 */

/**
 * @type {StoreItem[]} storeItems
 */
const storeItems = [
  { orderTypeId: 1, price: DEFAULT_PULL_PRICE, amount: 600 },
  { orderTypeId: 2, price: 0.99, amount: 1200 },
  { orderTypeId: 3, price: 2.99, amount: 3800 },
  { orderTypeId: 4, price: 4.99, amount: 6600 },
  { orderTypeId: 5, price: 9.99, amount: 14000 },
  { orderTypeId: 6, price: 19.99, amount: 30000 },
  { orderTypeId: 7, price: 49.99, amount: 80400 },
  { orderTypeId: 8, price: 99.99, amount: 178000 },
];

/**
 * Get all store items with the amount of pulls they give and the percentage of money saved
 * @returns {StoreItemWithStats[]}
 */
export const getStoreItems = () =>
  storeItems.map((item) => {
    return {
      ...item,
      pulls: getPullsForAmount(item.amount),
      savedPercentage: Math.max(getPercentagePriceSavedForAmount(item.price, item.amount), 0),
    };
  });
