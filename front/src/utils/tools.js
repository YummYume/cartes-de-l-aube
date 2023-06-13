/**
 * @param {{}} data
 * @param {string[]} path
 * @returns any
 */
export const findByKey = (data, path) => {
  const val = data[path[0]];
  if (val) {
    if (path.length > 1) {
      if (typeof val === 'object') {
        findByKey(val, data.slice(1));
      } else {
        return null;
      }
    }

    return val;
  }

  return null;
};

/**
 * @param {string} value
 * @returns string[]|null
 */
export const findInString = (value) => {
  const matches = value.match(/{([^}]+)}/g);
  if (matches) {
    return matches.map((match) => match.replace(/[\s{}]+/g, '').split('.'));
  }

  return null;
};
