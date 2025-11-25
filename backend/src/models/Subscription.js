const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'restaurants',
      key: 'id'
    }
  },
  plan: {
    type: DataTypes.ENUM('monthly', 'yearly'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'pending'),
    defaultValue: 'active'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'subscriptions',
  hooks: {
    beforeCreate: (subscription) => {
      // Auto-calculate end date based on plan
      const startDate = new Date(subscription.startDate);
      if (subscription.plan === 'monthly') {
        subscription.endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
      } else if (subscription.plan === 'yearly') {
        subscription.endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
      }
    }
  }
});

module.exports = Subscription;