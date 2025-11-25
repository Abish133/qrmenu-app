const cron = require('node-cron');
const { Subscription } = require('../models');
const { Op } = require('sequelize');

class CronService {
  static startSubscriptionChecker() {
    // Run daily at midnight to check for expired subscriptions
    cron.schedule('0 0 * * *', async () => {
      try {
        console.log('Running subscription expiry check...');
        
        const expiredCount = await Subscription.update(
          { status: 'expired' },
          {
            where: {
              status: 'active',
              endDate: { [Op.lt]: new Date() }
            }
          }
        );

        console.log(`Updated ${expiredCount[0]} expired subscriptions`);
      } catch (error) {
        console.error('Error updating expired subscriptions:', error);
      }
    });

    console.log('Subscription checker cron job started');
  }
}

module.exports = CronService;