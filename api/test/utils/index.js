/**
 * @typedef {import('http').IncomingHttpHeaders | import('http').OutgoingHttpHeaders} Headers
 */

const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * @type {Headers} globalHeaders
 */
let globalHeaders = defaultHeaders;

const apiMethod = async (url, method, payload, headers) => {
  const fetchHeaders = {
    ...globalHeaders,
    ...headers,
  };

  if (!payload && fetchHeaders['Content-Type'] === 'application/json') {
    delete fetchHeaders['Content-Type'];
  }

  const res = await fetch(`http://localhost:9999${url}`, {
    method,
    body: JSON.stringify(payload),
    headers: fetchHeaders,
    credentials: 'include',
  });

  return res;
};

/**
 * @returns {{
 *  post: (url: string, payload: any, headers: Headers) => Promise<any>,
 *  get: (url: string, headers: Headers) => Promise<any>,
 *  put: (url: string, payload: any, headers: Headers) => Promise<any>,
 *  delete: (url: string, headers: Headers) => Promise<any>
 * }}
 */
export const api = {
  post: async (url, payload, headers = {}) => apiMethod(url, 'POST', payload, headers),
  get: async (url, headers = {}) => apiMethod(url, 'GET', undefined, headers),
  put: async (url, payload, headers = {}) => apiMethod(url, 'PUT', payload, headers),
  delete: async (url, headers = {}) => apiMethod(url, 'DELETE', undefined, headers),
};

/**
 * Set the global headers to be used in the api wrapper
 * @param {Headers} headers
 */
export const setGlobalHeaders = (headers) => {
  globalHeaders = headers;
};

/**
 * Add headers to the global headers
 * @param {Headers} headers
 */
export const addGlobalHeaders = (headers) => {
  globalHeaders = { ...globalHeaders, ...headers };
};

/**
 * Remove headers from the global headers
 * @param {Headers} headers
 */
export const removeGlobalHeaders = (headers) => {
  for (const header of headers) {
    delete globalHeaders[header];
  }
};

/**
 * Reset the global headers
 */
export const resetGlobalHeaders = () => {
  globalHeaders = defaultHeaders;
};

/**
 * The default credentials to be used in the tests
 */
export const defaultCredentials = {
  username: 'test',
  password: 'Password123',
  confirmPassword: 'Password123',
};

/**
 * Legacy api inject
 * @param {Fastify} app
 * @param {Headers} globalHeaders
 * @returns {{
 *  post: (url: string, payload: any, headers: Headers) => Promise<import('fastify').FastifyReply<import('http').ServerResponse>>,
 *  get: (url: string, headers: Headers) => Promise<import('fastify').FastifyReply<import('http').ServerResponse>>,
 *  put: (url: string, payload: any, headers: Headers) => Promise<import('fastify').FastifyReply<import('http').ServerResponse>>,
 *  delete: (url: string, headers: Headers) => Promise<import('fastify').FastifyReply<import('http').ServerResponse>>
 * }}
 */
export function apiInject(app, globalHeaders = {}) {
  const method = async (url, method, payload, headers) => {
    return app.inject({
      method,
      url,
      payload,
      headers: {
        ...globalHeaders,
        ...headers,
      },
    });
  };

  return {
    post: async (url, payload, headers = {}) => method(url, 'POST', payload, headers),
    get: async (url, headers = {}) => method(url, 'GET', undefined, headers),
    put: async (url, payload, headers = {}) => method(url, 'PUT', payload, headers),
    delete: async (url, headers = {}) => method(url, 'DELETE', undefined, headers),
  };
}
