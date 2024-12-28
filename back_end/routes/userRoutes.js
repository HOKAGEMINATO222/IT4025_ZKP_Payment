const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Endpoint lấy danh sách tất cả người dùng
router.get('/', userController.getAllUsers);

// Endpoint lấy thông tin người dùng theo ID
router.get('/:id', userController.getUserById);

module.exports = router;
