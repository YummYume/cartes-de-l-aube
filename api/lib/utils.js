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
