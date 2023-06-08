/**
 * @param {import("../../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', async (request, reply) => {
    const token = await reply.jwtSign({ id: '1234' }, { expiresIn: '10s' });
    reply
      .setCookie('token', token, {
        domain: 'api.carte.local',
        path: '/',
        secure: false,
        httpOnly: true,
        sameSite: true,
      })
      .code(200)
      .send({ message: 'token & refresh token' });
  });
};
