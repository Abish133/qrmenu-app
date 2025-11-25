const { Subscription, Restaurant, SubscriptionPlan } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const RazorpayService = require('../services/razorpayService');

class SubscriptionController {
  static async getSubscription(req, res) {
    try {
      const restaurant = await Restaurant.findOne({
        where: { userId: req.user.id },
        include: [{
          model: Subscription,
          as: 'subscriptions',
          order: [['createdAt', 'DESC']]
        }]
      });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      const activeSubscription = restaurant.subscriptions.find(
        sub => sub.status === 'active' && new Date(sub.endDate) > new Date()
      );

      res.json({
        activeSubscription,
        subscriptionHistory: restaurant.subscriptions
      });
    } catch (error) {
      console.error('Get subscription error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createOrder(req, res) {
    try {
      const { planId } = req.body;
      
      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Get plan details from database
      const plan = await SubscriptionPlan.findOne({ 
        where: { id: planId, isActive: true } 
      });

      if (!plan) {
        return res.status(400).json({ message: 'Invalid plan selected' });
      }

      const amount = plan.price;
      const receipt = `sub_${restaurant.id}_${Date.now()}`;

      const order = await RazorpayService.createOrder(amount, 'INR', receipt);

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        planDetails: plan
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ message: 'Failed to create payment order' });
    }
  }

  static async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
      
      const isValid = RazorpayService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }

      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Get plan details from database
      const plan = await SubscriptionPlan.findOne({ 
        where: { id: planId, isActive: true } 
      });

      if (!plan) {
        return res.status(400).json({ message: 'Invalid plan' });
      }

      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

      // Expire existing active subscriptions
      await Subscription.update(
        { status: 'expired' },
        {
          where: {
            restaurantId: restaurant.id,
            status: 'active'
          }
        }
      );

      // Create new subscription
      const subscription = await Subscription.create({
        restaurantId: restaurant.id,
        plan: plan.name,
        price: plan.price,
        startDate,
        endDate,
        status: 'active',
        paymentMethod: 'razorpay',
        transactionId: razorpay_payment_id
      });

      res.json({
        message: 'Payment verified and subscription activated',
        subscription
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ message: 'Payment verification failed' });
    }
  }

  static async createSubscription(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { plan, paymentMethod, transactionId } = req.body;
      
      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Set pricing based on plan
      const pricing = {
        monthly: 499,
        yearly: 4999
      };

      // Expire any existing active subscriptions
      await Subscription.update(
        { status: 'expired' },
        {
          where: {
            restaurantId: restaurant.id,
            status: 'active'
          }
        }
      );

      const subscription = await Subscription.create({
        restaurantId: restaurant.id,
        plan,
        price: pricing[plan],
        paymentMethod,
        transactionId,
        startDate: new Date(),
        status: 'active'
      });

      res.status(201).json({ subscription });
    } catch (error) {
      console.error('Create subscription error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPlans(req, res) {
    try {
      const plans = await SubscriptionPlan.findAll({
        where: { isActive: true },
        order: [['price', 'ASC']]
      });
      res.json({ plans });
    } catch (error) {
      console.error('Get plans error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllSubscriptions(req, res) {
    try {
      const subscriptions = await Subscription.findAll({
        include: [{
          model: Restaurant,
          as: 'restaurant',
          attributes: ['name', 'slug']
        }],
        order: [['createdAt', 'DESC']]
      });

      res.json({ subscriptions });
    } catch (error) {
      console.error('Get all subscriptions error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = SubscriptionController;