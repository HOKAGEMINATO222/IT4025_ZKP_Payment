const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Transaction = require('../models/TransactionModel');

// Route xử lý giao dịch
router.post('/transaction', async (req, res) => {
    const { amount, type } = req.body;  // amount là số tiền và type là loại giao dịch (deposit/withdrawal)

    try {
        // Lấy người dùng cố định từ database
        const user = await User.findOne();

        // Kiểm tra số dư trước khi thực hiện giao dịch rút tiền
        if (type === 'withdrawal' && user.balance < amount) {
            return res.status(400).json({ error: 'Số dư không đủ để thực hiện giao dịch.' });
        }

        // Cập nhật số dư
        let newBalance;
        if (type === 'withdrawal') {
            newBalance = user.balance - amount;
        } else if (type === 'deposit') {
            newBalance = user.balance + amount;
        }

        // Cập nhật số dư cho người dùng
        user.balance = newBalance;
        await user.save();

        // Ghi lại giao dịch
        const transaction = new Transaction({ amount, type });
        await transaction.save();

        // Trả về kết quả
        res.json({ message: 'Giao dịch thành công!', balance: newBalance });

    } catch (error) {
        console.error('Lỗi giao dịch:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra trong khi thực hiện giao dịch.' });
    }
});

module.exports = router;
