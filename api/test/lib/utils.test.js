import { describe, expect, test } from 'vitest';

import { cmd, keysRemover, objInArr, wait } from '../../lib/utils';

describe.concurrent('utils', () => {
  describe('cmd', () => {
    test('should run command successfully', async () => {
      const code = await cmd('echo', 'hello');

      expect(code).toBe(0);
    });
  });

  describe('keysRemover', () => {
    test('should remove keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = ['a', 'c'];
      const newObj = keysRemover(obj, keys);

      expect(newObj).toEqual({ b: 2 });
    });
  });

  describe('objInArr', () => {
    test('should return true if object exists in array', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const obj = { id: 2 };
      const targetKey = 'id';
      const result = objInArr(arr, obj, targetKey);

      expect(result).toBe(true);
    });

    test('should return false if object does not exist in array', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const obj = { id: 4 };
      const targetKey = 'id';
      const result = objInArr(arr, obj, targetKey);

      expect(result).toBe(false);
    });
  });

  describe('wait', () => {
    test('should wait for specified time', async () => {
      const start = Date.now();

      await wait(1000);

      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(1000);
    });
  });
});
