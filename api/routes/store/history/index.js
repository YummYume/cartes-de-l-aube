/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  fastify.get('/', {
    onRequest: fastify.auth([fastify.tokenVerify]),
    handler: async (/** @type {CustomRequest} request */ request) => {
      /**
       * @type {{ paymentRepository: PaymentRepository }}
       */
      const { paymentRepository } = fastify.typeorm;

      const payments = await paymentRepository.find({
        where: { user: request.user.id },
        order: { paidAt: 'DESC' },
      });

      return {
        payments,
      };
    },
  });
};
