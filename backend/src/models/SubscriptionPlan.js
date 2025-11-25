const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in days'
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  badgeText: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Badge text like "Christmas Offer", "Diwali Special"'
  },
  badgeColor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'blue',
    comment: 'Badge color: red, green, blue, purple, orange, pink'
  },
  badgeEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether to show the badge or not'
  }
}, {
  tableName: 'subscription_plans'
});

module.exports = SubscriptionPlan;