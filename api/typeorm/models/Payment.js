export class Payment {
  /**
   * The payment id.
   * @type {number} id
   */
  id;

  /**
   * The Stripe payment id.
   * @type {string} stripePaymentId
   */
  stripePaymentId;

  /**
   * The payment's price (in euro).
   * @type {number} price
   */
  price;

  /**
   * The amount of orundum received.
   * @type {number} amount
   */
  amount;

  /**
   * The payment's date.
   * @type {Date} paidAt
   */
  paidAt;

  /**
   * The user who paid.
   * @type {import('./User').User} user
   */
  user;

  /**
   * Creates an instance of Payment.
   * @class
   * @param {typeof Payment.prototype.id} id
   * @param {typeof Payment.prototype.stripePaymentId} stripePaymentId
   * @param {typeof Payment.prototype.price} price
   * @param {typeof Payment.prototype.amount} amount
   * @param {typeof Payment.prototype.paidAt} paidAt
   * @param {typeof Payment.prototype.user} user
   */
  constructor(id, stripePaymentId, price, amount, paidAt, user) {
    this.id = id;
    this.stripePaymentId = stripePaymentId;
    this.price = price;
    this.amount = amount;
    this.paidAt = paidAt;
    this.user = user;
  }
}
