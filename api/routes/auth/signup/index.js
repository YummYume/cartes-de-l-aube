import bcrypt from 'bcrypt';

import { env } from '../../../config/config.js';
import { RefreshToken } from '../../../mongoose/models/RefreshToken.js';
import { User } from '../../../typeorm/models/User.js';
import { userSignupValidation } from '../../../typeorm/schema/UserSchema.js';

/**
 * @param {import("../../../app").Fastify} fastify
 */
export default async (fastify) => {
  fastify.post('/', async (request, reply) => {
    const { body } = request;
    /**
     * @type {{userRepository: import('typeorm').Repository<User>}}}
     */
    const { userRepository } = fastify.typeorm;

    // Validation
    const { error } = userSignupValidation(body);
    if (error) {
      return reply.code(422).send({ errors: error.issues });
    }

    // Create User
    const salt = await bcrypt.genSalt(env.saltFactor);

    const newUser = new User();
    newUser.username = body.username;
    newUser.password = await bcrypt.hash(body.password, salt);
    newUser.image = 'image';
    newUser.originium = 100;

    try {
      const { password, ...user } = await userRepository.save(newUser);

      // Create Cookie HTTP Jwt & Refresh Jwt Token
      const tk = await reply.jwtSign({ id: user.id }, { expiresIn: '15m' });
      const refreshTk = await reply.jwtSign({ id: user.id }, { expiresIn: '7d' });

      await RefreshToken.create({ refreshTk, tk, user: user.id });

      return reply.setCookie(env.cookie.name, tk, env.cookie.config).code(201).send(user);
    } catch (err) {
      const message =
        err.code === 'ER_DUP_ENTRY'
          ? 'Username already taken, please choose another one.'
          : 'Error when you try to signup, please try again.';

      return reply.code(409).send({ message });
    }
  });
};
