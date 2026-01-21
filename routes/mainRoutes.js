const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const checkAuth = require('../middleware/authMiddleware');

router.get('/', checkAuth, mainController.getHome);
router.get('/profile', checkAuth, mainController.getProfile);

// Placeholders
const placeholders = ['/pages', '/work', '/blog', '/features'];
placeholders.forEach(route => {
    router.get(route, checkAuth, mainController.getPlaceholder);
});

module.exports = router;
