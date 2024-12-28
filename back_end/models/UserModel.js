// models/User.js
const mongoose = require("mongoose");

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Vũ Trần Hoàng", // Cố định tên người dùng
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "user",
  },
  balance: {
    type: Number,
    required: true,
    default: 1000, // Cố định số dư người dùng
  },
});

// Tạo model User từ schema
const User = mongoose.model("TestUser", userSchema);

module.exports = User;
