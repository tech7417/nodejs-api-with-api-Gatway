const express = require('express');
const router = express.Router();
const userController = require('../controller/auth-controller');
const { verifyToken, isAuthenticated, isAdmin } = require('../middleware/auth');
router.get('/users/profile',verifyToken,  userController.getloginUserProfile)
router.post('/register', userController.createUser);
router.post('/loginWithOtp', userController.userLoginWithOtp);
router.post('/verify-otp', userController.verifyOtp);
router.get('/logout', verifyToken, isAuthenticated, userController.logout);
router.get('/admin/users', verifyToken, isAuthenticated, isAdmin, userController.getUsers);
//router.get('/users/:id', verifyToken, isAuthenticated,  userController.getSingleUser);
router.get('/users/:id',  userController.getSingleUser);

router.put('/users/:id', verifyToken, isAuthenticated,  userController.updateUser);
router.delete('/admin/users/:id',verifyToken, isAuthenticated, isAdmin,  userController.deleteUserById);
router.get('/users', userController.getUsers);
// Admin login route
router.post('/login', userController.login);


module.exports = router;