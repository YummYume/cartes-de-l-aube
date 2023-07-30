import { describe, expect, test } from 'vitest';

import {
  DEFAULT_PULL_COST,
  getCostForPulls,
  getPercentagePriceSavedForAmount,
  getPullsForAmount,
  getRandomRarities,
  getRarities,
  getRefundForDuplicate,
} from '../../lib/rarity.js';

describe.concurrent('rarity', () => {
  test('getCostForPulls returns the correct cost for one pull', () => {
    expect(getCostForPulls(1)).toBe(DEFAULT_PULL_COST);
  });

  test('getCostForPulls returns the correct cost for multiple pulls', () => {
    expect(getCostForPulls(5)).toBe(DEFAULT_PULL_COST * 5);
  });

  test('getPullsForAmount returns the correct number of pulls for a given amount', () => {
    expect(getPullsForAmount(DEFAULT_PULL_COST)).toBe(1);
  });

  test('getPullsForAmount returns the correct number of pulls for a given amount that is not a multiple of the default pull cost', () => {
    expect(getPullsForAmount(DEFAULT_PULL_COST * 2 + 100)).toBe(2);
  });

  test('getPercentagePriceSavedForAmount returns the correct percentage of money saved for a pack', () => {
    expect(getPercentagePriceSavedForAmount(99.99, 178000)).toBe(32);
  });

  test('getRandomRarities returns an array of the correct length with random rarities', () => {
    const randomRarities = getRandomRarities(5);

    expect(getRandomRarities(5)).toHaveLength(5);

    randomRarities.forEach((r) => {
      expect(getRarities()).toContain(r);
    });
  });

  test('getRefundForDuplicate returns the correct refund for a rarity', () => {
    expect(getRefundForDuplicate(3)).toBe(DEFAULT_PULL_COST * 0.25);
  });

  test('getRefundForDuplicate returns 0 for an invalid rarity', () => {
    expect(getRefundForDuplicate(2)).toBe(0);
  });
});
