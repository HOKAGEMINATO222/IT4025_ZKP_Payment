// config/db.js
const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Kết nối đến MongoDB thành công!');
    } catch (error) {
        console.error('Kết nối đến MongoDB thất bại:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
