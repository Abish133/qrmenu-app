const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const MenuController = require('../controllers/menuController');
const { authenticate } = require('../middleware/auth');
const { checkSubscription } = require('../middleware/subscription');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = path.join(__dirname, '../../uploads');
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Validation rules
const categoryValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Category name must be 2-100 characters')
];

const menuItemValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Item name must be 2-100 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

const menuItemCreateValidation = [
  ...menuItemValidation,
  body('categoryId').isInt().withMessage('Valid category ID required')
];

// Routes
router.get('/', authenticate, MenuController.getMenu);

// Category routes
router.post('/categories', authenticate, checkSubscription, categoryValidation, MenuController.createCategory);
router.put('/categories/:id', authenticate, checkSubscription, categoryValidation, MenuController.updateCategory);
router.delete('/categories/:id', authenticate, checkSubscription, MenuController.deleteCategory);

// Menu item routes
router.post('/items', authenticate, checkSubscription, upload.array('images', 5), menuItemCreateValidation, MenuController.createMenuItem);
router.put('/items/:id', authenticate, checkSubscription, upload.array('images', 5), menuItemValidation, MenuController.updateMenuItem);
router.delete('/items/:id', authenticate, checkSubscription, MenuController.deleteMenuItem);

module.exports = router;