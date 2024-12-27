const mongoose = require('mongoose');

// Định nghĩa schema cho giao dịch
const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true }, // Số tiền giao dịch
    transactionType: { type: String, required: true,  enum: ['deposit', 'withdrawal'] }, // Loại giao dịch (nạp/rút)
    transactionDate: { type: Date, default: Date.now }, // Thời gian giao dịch
    status: { type: String, default: 'pending', enum: ['pending', 'success', 'failed'] }, // Trạng thái giao dịch
  },
  { timestamps: true }
);

// Tạo model từ schema
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
