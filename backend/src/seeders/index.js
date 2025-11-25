const { sequelize } = require('../models');
const { seedDemoData } = require('./demoData');

const runSeeders = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync database (create tables)
    await sequelize.sync({ force: true }); // This will drop and recreate tables
    console.log('Database tables created');

    // Run seeders
    await seedDemoData();

    console.log('\n✨ All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = { runSeeders };