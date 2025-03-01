const express = require('express');
const router = express.Router();
const {createUser, getAllUsers, login, getProfile, updateUser, deleteUserById} = require('../controller/user-controller');
const {verifyToken, isAuthenticated, isAdmin} = require('../middleware/auth');

router.post("/register", createUser);
router.post("/login", login)
router.get('/admin/users', verifyToken, isAuthenticated, isAdmin, getAllUsers)
router.get('/users',verifyToken, isAuthenticated,  getProfile);
router.put('/admin/users/:id',verifyToken, isAuthenticated, isAdmin, updateUser);
router.delete('/admin/users/:id',verifyToken, isAuthenticated, isAdmin, deleteUserById);

module.exports = router