const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const snarkjs = require("snarkjs");
const connectDB = require("./config/db");
const authenticationRoutes = require("./routes/authentication");
const User = require("./models/UserModel"); // Import model User
const Transaction = require("./models/TransactionModel"); // Import model User

require("dotenv").config();

const app = express();

// Connect to MongoDB Atlas
connectDB();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS
    credentials: true, // Allow cookies and credentials
  })
);

// Handle Preflight Requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204); // No Content
});

// Middleware to parse JSON
app.use(bodyParser.json());

// Enable cookie parser
app.use(cookieParser());

// Path to circuits directory
const circuitsPath = path.join(__dirname, "circuits");

// Serve static files from circuits directory
app.use("/circuits", express.static(circuitsPath));

app.use("/api", authenticationRoutes);

// Load verification key
const verificationKey = JSON.parse(
  fs.readFileSync(path.join(circuitsPath, "verification_key.json"), "utf-8")
);

// Payment Route
app.post("/api/payment", async (req, res) => {
  try {
    const { proof, publicSignals, transactionAmount, userId } = req.body;
    console.log("id:", userId);
    // Lấy người dùng từ database theo userId
    const user = await User.findById(userId); // Tìm người dùng theo ID
    if (!user) {
      return res
        .status(404)
        .json({ isValid: false, message: "User not found." });
    }

    const userBalance = user.balance;

    // Kiểm tra tính hợp lệ của proof
    const isValid = await snarkjs.groth16.verify(
      verificationKey,
      publicSignals,
      proof
    );

    if (isValid && publicSignals[0] === "1") {
      // Cập nhật số dư trong database
      const updatedBalance = userBalance - transactionAmount;

      // Cập nhật số dư vào MongoDB
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { balance: updatedBalance }, // Chỉ cập nhật trường balance
        { new: true } // Trả về đối tượng người dùng mới với balance đã cập nhật
      );

      const transaction = new Transaction({
        userID: userId,
        amount: transactionAmount,
        transactionType: "withdrawal",
        status: "success",
      });

      transaction.save();
      // Trả về thông tin đã cập nhật
      return res.json({
        isValid: true,
        updatedBalance: updatedUser.balance,
        transaction: transaction,
      });
    } else {
      return res.status(400).json({
        isValid: false,
        message: "Proof verification failed.",
      });
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
