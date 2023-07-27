import { EntitySchema } from 'typeorm';

import { Payment } from '../models/Payment.js';

export default new EntitySchema({
  name: 'Payment',
  target: Payment,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    stripePaymentId: {
      type: 'varchar',
    },
    price: {
      type: 'float',
    },
    amount: {
      type: 'int',
    },
    paidAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      inversedBy: 'payments',
    },
  },
});
