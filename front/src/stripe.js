import { loadStripe } from '@stripe/stripe-js';

/**
 * @typedef {Awaited<ReturnType<typeof loadStripe>>} Stripe
 */

/**
 * @type {Stripe}
 */
let stripe = null;

/**
 * Initialize Stripe with the given options. Will only initialize once.
 * @param {Parameters<loadStripe>[1]} options
 * @returns {Promise<Stripe>}
 */
export const initStripe = async (options = {}) => {
  if (!stripe) {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY, options);
  }

  return stripe;
};

/**
 * Returns the Stripe instance. Will throw if not initialized.
 * @throws {Error} If Stripe is not initialized.
 * @returns {Stripe}
 */
export const getStripe = () => {
  if (!stripe) {
    throw new Error('Stripe is not initialized. Call initStripe() first.');
  }

  return stripe;
};
