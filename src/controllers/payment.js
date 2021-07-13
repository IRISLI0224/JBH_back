/* eslint-disable camelcase */
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);

const createPayment = async (req, res) => {
  const { amount, id, receipt_email } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'AUD',
      description: 'Japanese Bathhouse',
      payment_method: id,
      confirm: true,
      receipt_email,
    });

    res.json({
      message: 'Payment Successful',
      success: true,
    });
  } catch (error) {
    res.json({
      message: 'Payment Failed',
      success: false,
    });
  }
};

module.exports = { createPayment };
