import { getStoreItems } from '../../lib/store.js';
import { stripe } from '../../lib/stripe.js';

/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async () => {
      return {
        items: getStoreItems(),
      };
    },
  });

  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['orderTypeId'],
        properties: {
          orderTypeId: {
            type: 'number',
          },
        },
      },
    },
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
      const order = getStoreItems().find((item) => item.orderTypeId === request.body.orderTypeId);

      if (!order) {
        return fastify.httpErrors.notAcceptable(
          `Order type ${request.body.orderTypeId} does not exist.`
        );
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.price * 100,
        currency: 'eur',
        payment_method_types: ['card'],
        metadata: {
          orderTypeId: order.orderTypeId,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    },
  });

  fastify.patch('/', {
    schema: {
      body: {
        type: 'object',
        required: ['paymentId'],
        properties: {
          paymentId: {
            type: 'string',
          },
        },
      },
    },
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
      const paymentIntent = await stripe.paymentIntents.retrieve(request.body.paymentId);

      if (paymentIntent.status !== 'succeeded') {
        return fastify.httpErrors.notAcceptable('Payment did not succeed.');
      }

      const { orderTypeId } = paymentIntent.metadata;
      const order = getStoreItems().find((item) => item.orderTypeId === +orderTypeId);

      if (!order) {
        return fastify.httpErrors.notAcceptable(
          orderTypeId
            ? `Order type ${orderTypeId} does not exist.`
            : 'Order does not have a valid order type.'
        );
      }

      /**
       * @type {{ userRepository: UserRepository }}
       */
      const { userRepository } = fastify.typeorm;

      request.user = await userRepository.save({
        ...request.user,
        orundum: request.user.orundum + order.amount,
      });

      return {
        orundum: request.user.orundum,
      };
    },
  });

  fastify.delete('/', {
    schema: {
      body: {
        type: 'object',
        required: ['paymentId'],
        properties: {
          paymentId: {
            type: 'string',
          },
        },
      },
    },
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
      await stripe.paymentIntents.cancel(request.body.paymentId);

      return {
        success: true,
      };
    },
  });
};
