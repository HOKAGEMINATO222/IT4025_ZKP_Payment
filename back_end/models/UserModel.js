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

// Tạo virtual field `id` ánh xạ từ `_id`
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Đảm bảo virtual fields được bao gồm khi chuyển đổi sang JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Tạo model User từ schema
const User = mongoose.model("TestUser", userSchema);

module.exports = User;
