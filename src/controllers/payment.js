/* eslint-disable camelcase */
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);

const createPayment = async (amount, id, receipt_email) => {
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'AUD',
      description: 'Japanese Bathhouse',
      payment_method: id,
      confirm: true,
      receipt_email,
    });

    return {
      message: 'Payment Successful',
      success: true,
    };
  } catch (error) {
    return {
      message: 'Payment Failed',
      success: false,
    };
  }
};

module.exports = { createPayment };
