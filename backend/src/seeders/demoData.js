const { User, Restaurant, Category, MenuItem, Subscription } = require('../models');
const QRService = require('../services/qrService');

const seedDemoData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create demo restaurant user
    const demoUser = await User.create({
      name: 'Demo Restaurant Owner',
      email: 'demo@restaurant.com',
      password: 'password123',
      role: 'restaurant',
      status: 'active'
    });

    console.log('✅ Demo user created');

    // Create restaurant
    const slug = 'demo-restaurant';
    
    const restaurant = await Restaurant.create({
      userId: demoUser.id,
      name: 'Spice Garden Restaurant',
      slug: slug,
      address: 'Shop 15, MG Road, Connaught Place, New Delhi 110001',
      qrCodeUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/r/${slug}`,
      themeColor: '#D97706'
    });

    console.log('✅ Restaurant created');

    // Create active subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Add 1 month for monthly plan
    
    await Subscription.create({
      restaurantId: restaurant.id,
      plan: 'monthly',
      price: 999,
      startDate: startDate,
      endDate: endDate,
      status: 'active',
      paymentMethod: 'UPI',
      transactionId: 'demo_txn_123456'
    });

    console.log('✅ Subscription created');

    // Create categories and menu items
    const appetizers = await Category.create({
      restaurantId: restaurant.id,
      name: 'Appetizers',
      order: 1
    });

    const mains = await Category.create({
      restaurantId: restaurant.id,
      name: 'Main Courses',
      order: 2
    });

    const desserts = await Category.create({
      restaurantId: restaurant.id,
      name: 'Desserts',
      order: 3
    });

    const beverages = await Category.create({
      restaurantId: restaurant.id,
      name: 'Beverages',
      order: 4
    });

    console.log('✅ Categories created');

    // Appetizers
    await MenuItem.bulkCreate([
      {
        categoryId: appetizers.id,
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese cubes grilled to perfection with Indian spices',
        price: 299,
        available: true,
        order: 1
      },
      {
        categoryId: appetizers.id,
        name: 'Chicken 65',
        description: 'Spicy deep-fried chicken appetizer with curry leaves and green chilies',
        price: 349,
        available: true,
        order: 2
      },
      {
        categoryId: appetizers.id,
        name: 'Samosa Chaat',
        description: 'Crispy samosas topped with yogurt, chutneys and spices',
        price: 199,
        available: true,
        order: 3
      }
    ]);

    // Main Courses
    await MenuItem.bulkCreate([
      {
        categoryId: mains.id,
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato and cream gravy, served with basmati rice',
        price: 449,
        available: true,
        order: 1
      },
      {
        categoryId: mains.id,
        name: 'Biryani',
        description: 'Fragrant basmati rice cooked with spiced chicken and aromatic herbs',
        price: 399,
        available: true,
        order: 2
      },
      {
        categoryId: mains.id,
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked with butter and spices, served with naan',
        price: 299,
        available: true,
        order: 3
      },
      {
        categoryId: mains.id,
        name: 'Paneer Makhani',
        description: 'Cottage cheese cubes in rich tomato and cashew gravy',
        price: 349,
        available: false,
        order: 4
      }
    ]);

    // Desserts
    await MenuItem.bulkCreate([
      {
        categoryId: desserts.id,
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
        price: 149,
        available: true,
        order: 1
      },
      {
        categoryId: desserts.id,
        name: 'Kulfi',
        description: 'Traditional Indian ice cream flavored with cardamom and pistachios',
        price: 129,
        available: true,
        order: 2
      },
      {
        categoryId: desserts.id,
        name: 'Ras Malai',
        description: 'Soft cottage cheese dumplings in sweetened milk with cardamom',
        price: 169,
        available: true,
        order: 3
      }
    ]);

    // Beverages
    await MenuItem.bulkCreate([
      {
        categoryId: beverages.id,
        name: 'Lassi',
        description: 'Traditional yogurt-based drink, sweet or salted',
        price: 89,
        available: true,
        order: 1
      },
      {
        categoryId: beverages.id,
        name: 'Masala Chai',
        description: 'Spiced tea brewed with milk and aromatic Indian spices',
        price: 49,
        available: true,
        order: 2
      },
      {
        categoryId: beverages.id,
        name: 'Fresh Lime Soda',
        description: 'Refreshing lime juice with soda water and mint',
        price: 69,
        available: true,
        order: 3
      },
      {
        categoryId: beverages.id,
        name: 'Mango Juice',
        description: 'Fresh seasonal mango juice',
        price: 99,
        available: true,
        order: 4
      }
    ]);

    console.log('✅ Menu items created');

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@qrmenu.com',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    });

    console.log('✅ Admin user created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('Restaurant Owner:');
    console.log('  Email: demo@restaurant.com');
    console.log('  Password: password123');
    console.log('\nAdmin:');
    console.log('  Email: admin@qrmenu.com');
    console.log('  Password: admin123');
    console.log('\n🔗 Public Menu URL:');
    console.log(`  ${process.env.FRONTEND_URL || 'http://localhost:5173'}/r/demo-restaurant`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

module.exports = { seedDemoData };