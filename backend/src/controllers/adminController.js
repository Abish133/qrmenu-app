const { User, Restaurant, Subscription, SubscriptionPlan } = require('../models');
const { validationResult } = require('express-validator');

class AdminController {
  static async createAdmin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create admin user
      const admin = await User.create({
        name,
        email,
        password,
        role: 'admin'
      });

      res.status(201).json({
        message: 'Admin created successfully',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllRestaurants(req, res) {
    try {
      const restaurants = await Restaurant.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'email']
          },
          {
            model: Subscription,
            as: 'subscriptions',
            order: [['createdAt', 'DESC']],
            limit: 1
          }
        ]
      });

      res.json({ restaurants });
    } catch (error) {
      console.error('Get all restaurants error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getStats(req, res) {
    try {
      const totalRestaurants = await Restaurant.count();
      const totalUsers = await User.count({ where: { role: 'restaurant' } });
      const activeSubscriptions = await Subscription.count({ 
        where: { 
          status: 'active',
          endDate: { [require('sequelize').Op.gt]: new Date() }
        }
      });

      res.json({
        totalRestaurants,
        totalUsers,
        activeSubscriptions
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getSubscriptionPlans(req, res) {
    try {
      const plans = await SubscriptionPlan.findAll({
        where: { isActive: true },
        order: [['price', 'ASC']]
      });
      res.json({ plans });
    } catch (error) {
      console.error('Get subscription plans error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateSubscriptionPlan(req, res) {
    try {
      const { id } = req.params;
      const { name, price, duration, features, badgeText, badgeColor, badgeEnabled } = req.body;

      await SubscriptionPlan.update(
        { name, price, duration, features, badgeText, badgeColor, badgeEnabled },
        { where: { id } }
      );

      res.json({ message: 'Subscription plan updated successfully' });
    } catch (error) {
      console.error('Update subscription plan error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AdminController;