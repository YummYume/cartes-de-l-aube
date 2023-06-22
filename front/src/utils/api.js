/**
 * @param {Response} response
 * @returns {Promise<{[key: string]: string}|null>}
 */
async function responseHandler(response) {
  /**
   * @type {{[key: string]: string}|null}
   */
  const data = await response.json();

  if (!response.ok) {
    if ([401, 403].includes(response.status)) {
      console.log('no access');
    }

    const error = data?.message || response.statusText;

    return Promise.reject(error);
  }

  return data;
}

/**
 * @param {('POST'|'GET'|'PUT'|'PATCH'|'DELETE')} method
 * @returns {(url: string, body: {[key: string]: string}|null, options: {credentials: string}, signal: AbortSignal|null) => Promise<{[key: string]: string}|null>}
 */
function request(method) {
  /**
   * @param {string} url
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

    const response = await fetch(`${import.meta.env.VITE_API_HOST}/${url}`, options);

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
