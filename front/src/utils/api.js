/**
 * @param {Response} response
 * @returns {Promise<{[key: string]: string}|null>}
 */
async function responseHandler(response) {
  if (!response.ok) {
    return Promise.reject(response);
  }

  /**
   * @type {{[key: string]: string}|null}
   */
  const data = await response.json();

  return data;
}

/**
 * @param {('POST'|'GET'|'PUT'|'PATCH'|'DELETE')} method
 * @returns {(url: string, body: {[key: string]: string}|null, options: {credentials: string}, signal: AbortSignal|null) => Promise<{[key: string]: string}|null>}
 */
function request(method) {
  /**
   * @param {string|URL} url
   * @param {{}|null} body
   * @param {RequestInit} options
   * @returns {Promise<{[key: string]: string}|null>}
   */
  return async (url, body = null, options = {}) => {
    options = { ...options, method, credentials: 'include' };

    if (!options.headers) {
      options.headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      });
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    let input = url;

    if (!(input instanceof URL)) {
      input = `${import.meta.env.VITE_API_HOST}/${input}`;
    }

    const response = await fetch(input, options);

    return responseHandler(response);
  };
}

export default {
  post: request('POST'),
  get: request('GET'),
  put: request('PUT'),
  patch: request('PATCH'),
  delete: request('DELETE'),
};
