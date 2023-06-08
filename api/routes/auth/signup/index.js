import bcrypt from 'bcrypt';

import { env } from '../../../config/config.js';
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

    const { error } = userSignupValidation(body);
    if (error) {
      return reply.code(422).send({ errors: error.issues });
    }

    const salt = await bcrypt.genSalt(env.saltFactor);

    let user = new User();
    user.username = body.username;
    user.password = await bcrypt.hash(body.password, salt);
    user.image = 'image';
    user.originium = 100;

    user = await userRepository.save(user);

    return reply.code(201).send(user);
  });
};
