const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const productController = require('../controller/product-controller');

const { verifyToken, isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', verifyToken, isAuthenticated, isAdmin, productController.updateProduct);
router.delete('/products/:id', verifyToken, isAuthenticated, isAdmin, productController.deleteProduct);

router.post('/products',verifyToken, isAuthenticated, isAdmin,  productController.createProducts);

module.exports = router;

