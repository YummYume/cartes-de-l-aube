import { describe, expect, test } from 'vitest';

import {
  OPERATOR_CLASSES,
  OPERATOR_RARITIES,
  definedOperatorStatisticsByClass,
  definedOperatorStatisticsByRarity,
  getOperatorPrimaryClass,
  getDefinedOperatorStatisticsByClassAndRarity,
} from '../../lib/api.js';

describe.concurrent('api', () => {
  test('OPERATOR_CLASSES contains all supported operator classes', () => {
    expect(OPERATOR_CLASSES).toEqual([
      'Vanguard',
      'Guard',
      'Defender',
      'Medic',
      'Sniper',
      'Specialist',
      'Caster',
      'Supporter',
    ]);
  });

  test('OPERATOR_RARITIES contains all supported operator rarities', () => {
    expect(OPERATOR_RARITIES).toEqual([3, 4, 5, 6]);
  });

  test('definedOperatorStatisticsByClass defines the multiplier for each statistic of an operator, based on their class', () => {
    expect(definedOperatorStatisticsByClass).toEqual({
      Vanguard: {
        hp: 1.1,
        atk: 1.1,
        def: 1,
      },
      Guard: {
        hp: 1.2,
        atk: 1.3,
        def: 0.75,
      },
      Defender: {
        hp: 1.5,
        atk: 0.6,
        def: 1.5,
      },
      Medic: {
        hp: 1.6,
        atk: 0.9,
        def: 0.9,
      },
      Sniper: {
        hp: 0.75,
        atk: 1.8,
        def: 0.75,
      },
      Caster: {
        hp: 0.9,
        atk: 1.6,
        def: 0.9,
      },
      Specialist: {
        hp: 1.1,
        atk: 1.1,
        def: 1.1,
      },
      Supporter: {
        hp: 1,
        atk: 1.3,
        def: 1,
      },
    });
  });

  test('definedOperatorStatisticsByRarity defines the multiplier for all statistics of an operator, based on their rarity', () => {
    expect(definedOperatorStatisticsByRarity).toEqual({
      3: 1,
      4: 1.1,
      5: 1.2,
      6: 1.3,
    });
  });

  test('getOperatorPrimaryClass returns the primary class of an operator', () => {
    const operator = {
      class: ['Guard', 'Specialist'],
    };

    expect(getOperatorPrimaryClass(operator)).toBe('Guard');
  });

  test('getDefinedOperatorStatisticsByClassAndRarity returns the formatted statistics of an operator', () => {
    const operator = {
      statistics: {
        base: {
          hp: '100',
          atk: '50',
          def: '30',
          cost: '20',
        },
      },
      rarity: 4,
      class: 'Guard',
    };

    expect(getDefinedOperatorStatisticsByClassAndRarity(operator)).toEqual({
      hp: 121,
      atk: 61,
      def: 33,
      cost: 5,
    });
  });
});
