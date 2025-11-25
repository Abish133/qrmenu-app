const sequelize = require('../config/database');
const User = require('./User');
const Restaurant = require('./Restaurant');
const Category = require('./Category');
const MenuItem = require('./MenuItem');
const Subscription = require('./Subscription');
const SubscriptionPlan = require('./SubscriptionPlan');

// Define associations
User.hasOne(Restaurant, { foreignKey: 'userId', as: 'restaurant' });
Restaurant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Restaurant.hasMany(Category, { foreignKey: 'restaurantId', as: 'categories' });
Category.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Category.hasMany(MenuItem, { foreignKey: 'categoryId', as: 'menuItems' });
MenuItem.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Restaurant.hasMany(Subscription, { foreignKey: 'restaurantId', as: 'subscriptions' });
Subscription.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

SubscriptionPlan.hasMany(Subscription, { foreignKey: 'planId', as: 'subscriptions' });
Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'planId', as: 'plan' });

module.exports = {
  sequelize,
  User,
  Restaurant,
  Category,
  MenuItem,
  Subscription,
  SubscriptionPlan
};