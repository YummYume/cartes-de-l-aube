import bcrypt from 'bcrypt';

import { env } from '../../../config/config.js';
import { RefreshToken } from '../../../mongoose/models/RefreshToken.js';
import { User } from '../../../typeorm/models/User.js';
import { userSignupValidation } from '../../../typeorm/schema/UserSchema.js';

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
    const { error } = userSignupValidation(body);

    if (error) {
      return reply.unprocessableEntity({ errors: error.issues });
    }

    // Create User
    const salt = await bcrypt.genSalt(env.saltFactor);

    const newUser = new User();
    newUser.username = body.username;
    newUser.password = await bcrypt.hash(body.password, salt);
    newUser.image = 'image';
    newUser.orundum = 12000;
    newUser.deck = [];

    try {
      const userCount = await userRepository.count();

      if (userCount === 0) {
        newUser.role = 'admin';
      }

      const { password, ...user } = await userRepository.save(newUser);

      // Create Cookie HTTP Jwt & Refresh Jwt Token
      const tk = await reply.jwtSign({ id: user.id }, { expiresIn: env.tokenExpireIn });
      const refreshTk = await reply.jwtSign(
        { id: user.id },
        { expiresIn: env.refreshTokenExpireIn }
      );

      await RefreshToken.create({ refreshTk, tk, user: user.id });

      return reply.setCookie(env.cookie.name, tk, env.cookie.config).code(201).send(user);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return reply.conflict('Username already taken, please choose another one.');
      }

      return reply.internalServerError('Error while trying to sign you up.');
    }
  });
};
