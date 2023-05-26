/**
 * @typedef {{message: string}} Example
 */

/**
 * Make a request to the /example endpoint.
 * @async
 * @returns {Promise<Example>}
 */
export const getExample = async () => {
  const example = await fetch(`${import.meta.env.VITE_API_HOST}/example`);

  return example.json();
};
