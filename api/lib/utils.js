import { spawn } from 'child_process';
import process from 'process';

/**
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export function keysRemover(obj, keys) {
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
}

/**
 * @param {[]} arr
 * @returns {[]}
 */
export function shuffleArray(arr) {
  const newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArr[i];

    newArr[i] = newArr[j];
    newArr[j] = temp;
  }

  return arr;
}

/**
 * Find object in array by a key
 * @param {[]} arr
 * @param {object} obj
 * @param {string} targetKey
 * @returns {boolean}
 */
export function objInArr(arr, obj, targetKey) {
  return arr.some((item) => item[targetKey] === obj[targetKey]);
}

/**
 * Wait for a time
 * @param {number} ms
 * @returns {Promise}
 */
export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Launch a command
 * @param {...string[]} command
 * @returns {Promise<void>}
 */
export function cmd(...command) {
  const p = spawn(command[0], command.slice(1));
  return new Promise((resolveFunc) => {
    p.stdout.on('data', (x) => {
      process.stdout.write(x.toString());
    });
    p.stderr.on('data', (x) => {
      process.stderr.write(x.toString());
    });
    p.on('exit', (code) => {
      resolveFunc(code);
    });
  });
}
