const { SubscriptionPlan } = require('../models');

const seedSubscriptionPlans = async () => {
  try {
    // Check if plans already exist
    const existingPlans = await SubscriptionPlan.count();
    if (existingPlans > 0) {
      console.log('Subscription plans already exist');
      return;
    }

    // Create default plans
    await SubscriptionPlan.bulkCreate([
      {
        name: 'monthly',
        price: 499.00,
        duration: 30,
        features: [
          'Unlimited menu items',
          'QR code generation',
          'Mobile responsive menu',
          'Basic analytics'
        ],
        isActive: true
      },
      {
        name: 'yearly',
        price: 4999.00,
        duration: 365,
        features: [
          'Everything in Monthly',
          'Priority support',
          'Advanced analytics',
          'Custom branding'
        ],
        isActive: true
      }
    ]);

    console.log('Default subscription plans created successfully');
  } catch (error) {
    console.error('Error seeding subscription plans:', error);
  }
};

module.exports = seedSubscriptionPlans;