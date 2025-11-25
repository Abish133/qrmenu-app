const { Restaurant, Category, MenuItem, Subscription } = require('../models');
const { Op } = require('sequelize');

class PublicController {
  static async getPublicMenu(req, res) {
    try {
      const { slug } = req.params;

      const restaurant = await Restaurant.findOne({
        where: { slug },
        include: [
          {
            model: Category,
            as: 'categories',
            include: [{
              model: MenuItem,
              as: 'menuItems',
              where: { available: true },
              required: false,
              order: [['order', 'ASC']]
            }],
            order: [['order', 'ASC']]
          },
          {
            model: Subscription,
            as: 'subscriptions',
            where: {
              status: 'active',
              endDate: { [Op.gt]: new Date() }
            },
            required: false,
            limit: 1,
            order: [['endDate', 'DESC']]
          }
        ]
      });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Check if subscription is active
      const hasActiveSubscription = restaurant.subscriptions && restaurant.subscriptions.length > 0;

      if (!hasActiveSubscription) {
        return res.json({
          restaurant: {
            name: restaurant.name,
            logo: restaurant.logo,
            address: restaurant.address,
            themeColor: restaurant.themeColor
          },
          subscriptionExpired: true,
          message: "This restaurant's digital menu is currently inactive."
        });
      }

      // Filter out categories with no available items
      const categoriesWithItems = restaurant.categories.filter(
        category => category.menuItems && category.menuItems.length > 0
      );

      res.json({
        restaurant: {
          name: restaurant.name,
          logo: restaurant.logo,
          address: restaurant.address,
          themeColor: restaurant.themeColor,
          categories: categoriesWithItems
        },
        subscriptionExpired: false
      });
    } catch (error) {
      console.error('Get public menu error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = PublicController;