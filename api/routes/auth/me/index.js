import bcrypt from 'bcrypt';

import { env } from '../../../config/config.js';
import { userUpdateValidation } from '../../../typeorm/schema/UserSchema.js';

/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (
      /** @type {CustomRequest} request */ request,
      /** @type {ReplyFastify} reply */ reply
    ) => {
      return reply.code(200).send(request.user);
    },
  });

  fastify.patch('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (
      /** @type {CustomRequest} request */ request,
      /** @type {ReplyFastify} reply */ reply
    ) => {
      /**
       * @type {{ userRepository: UserRepository }}
       */
      const { userRepository } = fastify.typeorm;
      const { body, user } = request;

      try {
        const fullBody = { password: '', confirmPassword: '', ...body };
        // Validation
        const { error } = userUpdateValidation(fullBody);

        if (error) {
          return reply.unprocessableEntity(error.issues.msg[0].message);
        }

        if (body.password) {
          const salt = await bcrypt.genSalt(env.saltFactor);
          user.password = await bcrypt.hash(body.password, salt);
        }

        await userRepository.save(user);

        return reply.code(200).send(user);
      } catch (err) {
        return reply.code(500).send({ message: 'Error while trying to update this account.' });
      }
    },
  });
};
