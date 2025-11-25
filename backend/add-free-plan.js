const { SubscriptionPlan } = require('./src/models');

async function addFreePlan() {
  try {
    const freePlan = await SubscriptionPlan.findOne({ where: { name: 'Free' } });
    
    if (freePlan) {
      console.log('Free plan already exists');
      return;
    }

    await SubscriptionPlan.create({
      name: 'Free',
      price: 0.00,
      duration: 30,
      features: [
        'Basic menu items',
        'QR code generation',
        'Mobile responsive menu'
      ],
      isActive: true
    });

    console.log('Free plan added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding free plan:', error);
    process.exit(1);
  }
}

addFreePlan();
