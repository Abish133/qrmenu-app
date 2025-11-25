const express = require('express');
const PublicController = require('../controllers/publicController');

const router = express.Router();

// Public menu route - no authentication required
router.get('/menu/:slug', PublicController.getPublicMenu);

module.exports = router;