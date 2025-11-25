const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  constructor() {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      this.enabled = true;
    } else {
      this.enabled = false;
      console.log('Razorpay not configured - payment features disabled');
    }
  }

  async createOrder(amount, currency = 'INR', receipt) {
    if (!this.enabled) {
      throw new Error('Razorpay not configured');
    }
    try {
      const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt,
      };

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      throw error;
    }
  }

  verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    if (!this.enabled) {
      return false;
    }
    try {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpaySignature;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  async getPaymentDetails(paymentId) {
    if (!this.enabled) {
      throw new Error('Razorpay not configured');
    }
    try {
      return await this.razorpay.payments.fetch(paymentId);
    } catch (error) {
      console.error('Get payment details error:', error);
      throw error;
    }
  }
}

module.exports = new RazorpayService();