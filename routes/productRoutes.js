const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const checkAuth = require('../middleware/authMiddleware');

router.get('/products', productController.getProducts);
router.get('/search', checkAuth, productController.getSearch);
router.get('/filter', checkAuth, productController.getFilter);
router.get('/shop', checkAuth, productController.getShop);
router.get('/product-indepth', checkAuth, productController.getProductIndepth);

module.exports = router;
