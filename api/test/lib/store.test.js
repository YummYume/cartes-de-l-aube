import { describe, expect, test } from 'vitest';

import { getStoreItems } from '../../lib/store';

describe.concurrent('store', () => {
  test('getStoreItems returns all store items with the amount of pulls they give and the percentage of money saved', () => {
    const storeItems = getStoreItems();

    expect(storeItems).toHaveLength(8);

    storeItems.forEach((item) => {
      expect(item).toHaveProperty('orderTypeId');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('amount');
      expect(item).toHaveProperty('pulls');
      expect(item).toHaveProperty('savedPercentage');
    });
  });
});
