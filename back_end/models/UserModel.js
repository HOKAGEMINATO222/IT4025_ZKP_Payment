const mongoose = require('mongoose');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Vũ Trần Hoàng'  
    },
    balance: {
        type: Number,
        required: true,
        default: 1000  
    }
});

// Tạo model User từ schema
const User = mongoose.model('TestUser', userSchema);

module.exports = User;
