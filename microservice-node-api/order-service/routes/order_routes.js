const express = require('express');
const router = express.Router();

const { verifyToken, isAuthenticated, isAdmin } = require('../middleware/auth');
const {createNewOrder, getSingleOrder, getAllOrders, updateOrder} = require('../controller/order_controller')
 // In your `orderRoutes.js`
 router.post('/orders', verifyToken,isAuthenticated, createNewOrder);
 router.get('/orders/:id', verifyToken,isAuthenticated, getSingleOrder);
 router.get('/admin/orders', verifyToken,isAuthenticated,isAdmin,  getAllOrders);
 router.put('/admin/orders/:id/status', verifyToken,isAuthenticated,isAdmin, updateOrder);
 
  



module.exports = router;