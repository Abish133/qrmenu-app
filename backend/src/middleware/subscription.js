const { Restaurant, Subscription } = require('../models');
const { Op } = require('sequelize');

const checkSubscription = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { userId: req.user.id },
      include: [{
        model: Subscription,
        as: 'subscriptions',
        where: {
          status: 'active',
          endDate: { [Op.gt]: new Date() }
        },
        required: false
      }]
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    const activeSubscription = restaurant.subscriptions?.[0];
    
    if (!activeSubscription) {
      return res.status(403).json({ 
        message: 'Active subscription required to access this feature.',
        subscriptionExpired: true
      });
    }

    req.restaurant = restaurant;
    req.subscription = activeSubscription;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking subscription status.' });
  }
};

module.exports = { checkSubscription };