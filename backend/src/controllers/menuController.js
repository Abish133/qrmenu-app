const { Category, MenuItem, Restaurant } = require('../models');
const { validationResult } = require('express-validator');

class MenuController {
  static async getMenu(req, res) {
    try {
      const restaurant = await Restaurant.findOne({
        where: { userId: req.user.id },
        include: [{
          model: Category,
          as: 'categories',
          include: [{
            model: MenuItem,
            as: 'menuItems',
            order: [['order', 'ASC']]
          }],
          order: [['order', 'ASC']]
        }]
      });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      res.json({ restaurant });
    } catch (error) {
      console.error('Get menu error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, order } = req.body;
      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      const category = await Category.create({
        restaurantId: restaurant.id,
        name,
        order: order || 0
      });

      res.status(201).json({ category });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, order } = req.body;
      
      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
      const category = await Category.findOne({
        where: { id, restaurantId: restaurant.id }
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.update({ name, order });
      res.json({ category });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
      
      const category = await Category.findOne({
        where: { id, restaurantId: restaurant.id }
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.destroy();
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createMenuItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { categoryId, name, description, price, available, order, isVeg } = req.body;
      const images = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];
      const image = images.length > 0 ? images[0] : null; // Keep backward compatibility

      console.log('Creating menu item with images:', images);

      // Verify category belongs to user's restaurant
      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
      const category = await Category.findOne({
        where: { id: categoryId, restaurantId: restaurant.id }
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const menuItem = await MenuItem.create({
        categoryId,
        name,
        description,
        price: parseFloat(price),
        image,
        images,
        available: available === 'true' || available === true,
        order: parseInt(order) || 0,
        isVeg: isVeg === 'true' || isVeg === true
      });

      res.status(201).json({ menuItem });
    } catch (error) {
      console.error('Create menu item error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateMenuItem(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, available, order, isVeg } = req.body;
      const images = req.files && req.files.length > 0 ? req.files.map(file => `uploads/${file.filename}`) : undefined;
      const image = images && images.length > 0 ? images[0] : undefined;

      console.log('Updating menu item with data:', { name, description, price, available, order, images });
      console.log('Request files:', req.files);
      console.log('Request body:', req.body);

      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
      const menuItem = await MenuItem.findOne({
        include: [{
          model: Category,
          as: 'category',
          where: { restaurantId: restaurant.id }
        }],
        where: { id }
      });

      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      const updateData = {
        name,
        description,
        price: parseFloat(price),
        available: available === 'true' || available === true,
        order: parseInt(order) || 0,
        isVeg: isVeg === 'true' || isVeg === true
      };
      
      if (images) {
        updateData.images = images;
        updateData.image = image; // Keep backward compatibility
      }

      await menuItem.update(updateData);
      
      // Fetch updated item
      const updatedItem = await MenuItem.findByPk(id);
      
      res.json({ menuItem: updatedItem });
    } catch (error) {
      console.error('Update menu item error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteMenuItem(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
      
      const menuItem = await MenuItem.findOne({
        include: [{
          model: Category,
          as: 'category',
          where: { restaurantId: restaurant.id }
        }],
        where: { id }
      });

      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      await menuItem.destroy();
      res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      console.error('Delete menu item error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = MenuController;