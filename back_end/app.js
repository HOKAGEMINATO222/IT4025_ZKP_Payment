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

// Payment Route
app.post("/api/payment", async (req, res) => {
  try {
    const { proof, publicSignals, transaction, userId } = req.body;
    // Lấy người dùng từ database theo userId
    const user = await User.findById(userId); // Tìm người dùng theo ID
    if (!user) {
      return res
        .status(404)
        .json({ isValid: false, message: "User not found." });
    }

    // Load verification key
    const verificationKey = JSON.parse(
      fs.readFileSync(path.join(circuitsPath, "verification_key.json"), "utf-8")
    );

    // Kiểm tra tính hợp lệ của proof
    const isValidZKP = await snarkjs.groth16.verify(
      verificationKey,
      publicSignals,
      proof
    );

    const isValid = publicSignals[0];

    if (!isValidZKP || isValid === "0") {
      return res
        .status(400)
        .json({ isValid: false, message: "Invalid transaction!" });
    }

    // Extract new balance hash from public signals
    const newBalanceHash = publicSignals[2];

    // Update the user's balance hash in the database
    await User.updateOne(
      { _id: userId },
      { $set: { balance: newBalanceHash } }
    );

    // Log the transaction
    await Transaction.create({
      userID: userId,
      amount: transaction,
      transactionType: "withdrawal",
      status: "success",
    });

    res.status(200).json({ isValid: true, newBalanceHash });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ isValid: false, message: "Server error" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
