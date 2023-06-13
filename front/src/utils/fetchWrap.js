/**
 * @param {Response} response
 */
function responseHandler(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status)) {
        console.log('no access');
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

/**
 * @param {("POST"|"GET"|"PUT"|"PATCH")} method
 */
function request(method) {
  /**
   * @param {string} url
   * @param {{}} body
   * @param {{}} headers
   * @param options
   */
  return (url, body, options = { credentials: 'include' }) => {
    options = { ...options, method };

    if (!options.headers) {
      options.headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      });
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(`${import.meta.env.VITE_API_HOST}/${url}`, options).then(responseHandler);
  };
}

export default {
  post: request('POST'),
  get: request('GET'),
  put: request('PUT'),
  patch: request('PATCH'),
};
