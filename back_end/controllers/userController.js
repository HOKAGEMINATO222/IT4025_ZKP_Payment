const User = require('../models/userModel'); // Import model User

// Lấy thông tin của tất cả người dùng
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Lấy tất cả người dùng từ database
        res.status(200).json(users);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin người dùng' });
    }
};

// Lấy thông tin của một người dùng dựa trên ID
const getUserById = async (req, res) => {
    const { id } = req.params; // Lấy ID từ URL params
    try {
        const user = await User.findById(id); // Tìm người dùng theo ID
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin người dùng' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
};