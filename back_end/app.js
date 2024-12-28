const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const snarkjs = require('snarkjs');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
require('dotenv').config();

const app = express();

// Kết nối đến MongoDB Atlas
connectDB();

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware đọc JSON
app.use(bodyParser.json());

// Đường dẫn tới thư mục circuits
const circuitsPath = path.join(__dirname, 'circuits');

// Thiết lập tệp tĩnh cho thư mục circuits
app.use('/circuits', express.static(circuitsPath));

// Tải verification key
const verificationKey = JSON.parse(fs.readFileSync(path.join(circuitsPath, 'verification_key.json'), 'utf-8'));

app.post('/payment', async (req, res) => {
    try {
        const { proof, publicSignals } = req.body;
        const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
        res.json({ isValid });
    } catch (error) {
        console.error('Error verifying proof:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Sử dụng routes cho người dùng
app.use('/api/users', userRoutes);

// Khởi động server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
