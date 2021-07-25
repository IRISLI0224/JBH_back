const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);

// eslint-disable-next-line camelcase
const createPayment = async (amount, id, receipt_email) => {
  const payment = await stripe.paymentIntents.create({
    amount,
    currency: 'AUD',
    description: 'Japanese Bathhouse',
    payment_method: id,
    confirm: true,
    receipt_email,
  });
};

const createPaymentContainer = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { amount, id, receipt_email } = req.body;
  try {
    const payment = await createPayment(amount, id, receipt_email);
    return res.json({
      message: 'Payment Successful',
      success: true,
    });
  } catch (error) {
    return res.json({
      message: 'Payment Failed',
      success: false,
    });
  }
};

module.exports = { createPayment, createPaymentContainer };
