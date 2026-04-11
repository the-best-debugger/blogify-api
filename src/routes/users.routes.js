const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js');
const authController = require('../controllers/auth.controller.js');

router.get('/:userId', userController.getSingleUser);
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;