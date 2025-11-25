const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const createAdminValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('adminKey').equals(process.env.ADMIN_CREATION_KEY || 'admin123').withMessage('Invalid admin key')
];

// Admin routes
router.post('/create-admin', createAdminValidation, AdminController.createAdmin);
router.get('/restaurants', authenticate, authorize('admin'), AdminController.getAllRestaurants);
router.get('/stats', authenticate, authorize('admin'), AdminController.getStats);
router.get('/subscription-plans', authenticate, authorize('admin'), AdminController.getSubscriptionPlans);
router.put('/subscription-plans/:id', authenticate, authorize('admin'), AdminController.updateSubscriptionPlan);

module.exports = router;