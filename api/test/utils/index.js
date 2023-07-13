/**
 * @typedef {import('http').IncomingHttpHeaders | import('http').OutgoingHttpHeaders} Headers
 */

/**
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
