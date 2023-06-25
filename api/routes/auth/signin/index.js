import bcrypt from 'bcrypt';

import { env } from '../../../config/config.js';
import { RefreshToken } from '../../../mongoose/models/RefreshToken.js';
import { User } from '../../../typeorm/models/User.js';
import { userSigninValidation } from '../../../typeorm/schema/UserSchema.js';

/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', async (request, reply) => {
    const { body } = request;
    /**
     * @type {{userRepository: UserRepository}}}
     */
    const { userRepository } = fastify.typeorm;

    // Validation
    const { error } = userSigninValidation(body);
    if (error) {
      return reply.code(422).send({ errors: error.issues });
    }

    try {
      // Find User
      const { password, ...user } = await userRepository.findOneOrFail({
        where: {
          username: body.username,
        },
      });

      // Check credentials
      const isValited = await bcrypt.compare(body.password, password);
      if (!isValited) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }
      // Create Cookie HTTP Jwt & Refresh Jwt Token
      const tk = await reply.jwtSign({ id: user.id }, { expiresIn: env.tokenExpireIn });
      const refreshTk = await reply.jwtSign(
        { id: user.id },
        { expiresIn: env.refreshTokenExpireIn }
      );

      await RefreshToken.create({ refreshTk, tk, user: user.id });

      return reply.setCookie(env.cookie.name, tk, env.cookie.config).code(200).send(user);
    } catch (err) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
  });
};
