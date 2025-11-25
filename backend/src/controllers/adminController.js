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
            include: [{
              model: SubscriptionPlan,
              as: 'subscriptionPlan'
            }],
            order: [['createdAt', 'DESC']],
            limit: 1
          }
        ]
      });

      const restaurantsWithSubscription = restaurants.map(restaurant => {
        const latestSubscription = restaurant.subscriptions?.[0];
        let subscriptionStatus = 'none';
        let remainingDays = 0;
        let expiryDate = null;

        if (latestSubscription) {
          const now = new Date();
          const endDate = new Date(latestSubscription.endDate);
          expiryDate = latestSubscription.endDate;
          
          if (latestSubscription.status === 'active' && endDate > now) {
            subscriptionStatus = 'active';
            remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          } else if (endDate < now) {
            subscriptionStatus = 'expired';
            remainingDays = 0;
          } else {
            subscriptionStatus = latestSubscription.status;
          }
        }

        return {
          ...restaurant.toJSON(),
          subscriptionInfo: {
            status: subscriptionStatus,
            expiryDate,
            remainingDays,
            planName: latestSubscription?.subscriptionPlan?.name || 'None'
          }
        };
      });

      res.json({ restaurants: restaurantsWithSubscription });
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

  static async extendSubscription(req, res) {
    try {
      const { restaurantId } = req.params;
      const { days } = req.body;

      const restaurant = await Restaurant.findByPk(restaurantId, {
        include: [{
          model: Subscription,
          as: 'subscriptions',
          order: [['createdAt', 'DESC']],
          limit: 1
        }]
      });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      const latestSubscription = restaurant.subscriptions?.[0];
      
      if (latestSubscription) {
        const currentEndDate = new Date(latestSubscription.endDate);
        const newEndDate = new Date(currentEndDate.getTime() + (days * 24 * 60 * 60 * 1000));
        
        await latestSubscription.update({
          endDate: newEndDate,
          status: 'active'
        });
      }

      res.json({ message: `Subscription extended by ${days} days` });
    } catch (error) {
      console.error('Extend subscription error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async grantFreeMonth(req, res) {
    try {
      const { restaurantId } = req.params;

      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      const freePlan = await SubscriptionPlan.findOne({
        where: { name: 'Free' }
      });

      if (!freePlan) {
        return res.status(404).json({ message: 'Free plan not found' });
      }

      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));

      await Subscription.create({
        restaurantId,
        planId: freePlan.id,
        startDate,
        endDate,
        status: 'active',
        paymentStatus: 'completed'
      });

      res.json({ message: '1 month free subscription granted' });
    } catch (error) {
      console.error('Grant free month error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AdminController;