/**
 * @typedef {{prefix: string, suffix: string}|null|undefined} UniqueIdOptions
 */

let id = 0;

/**
 * Get a unique id
 * @param {string|null} prefix
 * @param {string|null} suffix
 * @param {UniqueIdOptions} options
 * @returns {string}
 */
const getUniqueId = (prefix = null, suffix = null, options = { prefix: '', suffix: '' }) => {
  const idPrefix = prefix ?? options.prefix ?? '';
  const idSuffix = suffix ?? options.suffix ?? '';
  const uniqueId = `${idPrefix}${id}${idSuffix}`;

  id += 1;

  return uniqueId;
};

export const uniqueIdSymbol = Symbol('uniqueId');

export default {
  /**
   * @param {import('vue').App<HTMLElement>} app
   * @param {UniqueIdOptions} options
   */
  install: (app, options = { prefix: '', suffix: '' }) => {
    app.config.globalProperties.$uniqueId = (prefix = null, suffix = null) =>
      getUniqueId(prefix, suffix, options);

    app.directive('unique-id', {
      mounted(el, { value }) {
        el.setAttribute('id', getUniqueId(value.prefix ?? null, value.suffix ?? null, options));
      },
    });

    app.provide(uniqueIdSymbol, (prefix = null, suffix = null) =>
      getUniqueId(prefix, suffix, options)
    );
  },
};
