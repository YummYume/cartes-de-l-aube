/**
 * Generate a random key
 * @param {number} length
 * @returns {string}
 */
export function genKey(length = 5) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 *
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
