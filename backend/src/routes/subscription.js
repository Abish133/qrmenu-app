const express = require('express');
const { body } = require('express-validator');
const SubscriptionController = require('../controllers/subscriptionController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const subscriptionValidation = [
  body('plan').isIn(['monthly', 'yearly']).withMessage('Plan must be monthly or yearly'),
  body('paymentMethod').optional().trim().isLength({ min: 2, max: 50 }),
  body('transactionId').optional().trim().isLength({ min: 2, max: 100 })
];

// Routes
router.get('/', authenticate, SubscriptionController.getSubscription);
router.get('/plans', SubscriptionController.getPlans);
router.post('/create-order', authenticate, SubscriptionController.createOrder);
router.post('/verify-payment', authenticate, SubscriptionController.verifyPayment);
router.post('/', authenticate, subscriptionValidation, SubscriptionController.createSubscription);

// Admin routes
router.get('/all', authenticate, authorize('admin'), SubscriptionController.getAllSubscriptions);

module.exports = router;