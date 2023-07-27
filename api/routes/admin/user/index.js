import bcrypt from 'bcrypt';

import { env } from '../../../config/config.js';
import { userAdminUpdateValidation } from '../../../typeorm/schema/UserSchema.js';

/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    onRequest: fastify.auth([fastify.tokenVerify, fastify.guard]),
    handler: async (
      /** @type {CustomRequest} request */ request,
      /** @type {ReplyFastify} reply */ reply
    ) => {
      /**
       * @type {{ userRepository: UserRepository }}
       */
      const { userRepository } = fastify.typeorm;
      const page = Number(request.query.page) || 1;

      const [users, count] = await userRepository.findAndCount({
        take: 10,
        skip: (page - 1) * 10,
      });

      return reply.code(200).send({
        users,
        meta: {
          page,
          totalPage: Math.ceil(count / 10),
          totalCount: count,
        },
      });
    },
  });

  fastify.patch('/:id', {
    schema: {
      body: {
        type: 'object',
        required: ['role'],
        properties: {
          role: {
            type: 'string',
          },
        },
      },
    },
    onRequest: fastify.auth([fastify.tokenVerify, fastify.guard]),
    handler: async (
      /** @type {CustomRequest} request */ request,
      /** @type {ReplyFastify} reply */ reply
    ) => {
      /**
       * @type {{ userRepository: UserRepository }}
       */
      const { userRepository } = fastify.typeorm;
      const { id } = request.params;
      const { body } = request;

      try {
        const user = await userRepository.findOneOrFail({
          where: { id },
        });

        const fullBody = { password: '', confirmPassword: '', ...body };
        // Validation
        const { error } = userAdminUpdateValidation(fullBody);

        if (error) {
          return reply.unprocessableEntity(error.issues.msg[0].message);
        }

        if (body.password) {
          const salt = await bcrypt.genSalt(env.saltFactor);
          user.password = await bcrypt.hash(body.password, salt);
        }

        user.role = body.role;

        await userRepository.save(user);

        return reply.code(200).send(user);
      } catch (err) {
        if (err.name === 'EntityNotFound') {
          return reply.code(404).send({ message: 'User not found.' });
        }

        return reply.code(500).send({ message: 'Error while trying to update user.' });
      }
    },
  });
};
