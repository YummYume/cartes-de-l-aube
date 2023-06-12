import { toast } from 'vue3-toastify';

/**
 * @param {("POST"|"GET"|"PUT"|"PATCH")} method
 */
function request(method) {
  /**
   * @param {string} url
   * @param {{}} body
   * @param {{}} headers
   */
  return (url, body, headers = {}) => {
    const requestOptions = {
      method,
      headers,
    };
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(`${import.meta.env.VITE_API_HOST}/${url}`, requestOptions).then(responseHandler);
  };
}

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
      toast.error(error);
      return Promise.reject(error);
    }

    return data;
  });
}

export default {
  post: request('POST'),
  get: request('GET'),
  put: request('PUT'),
  patch: request('PATCH'),
};
