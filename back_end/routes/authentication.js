const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/UserModel");
const Transaction = require("../models/TransactionModel");
const circomlibjs = require("circomlibjs");

// Helper function to generate a JWT token and set it as a cookie
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ user_id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600000,
  });
};

// Middleware to authenticate requests
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user_id;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ success: false, message: "Invalid token!" });
  }
};

// Middleware to authenticate admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user_id);

    if (!user || user.type !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden!" });
    }

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
};

router.post(
  "/admin/create-user",
  authenticateUser,
  authenticateAdmin,
  async (req, res) => {
    const { name, password, balance, type } = req.body;

    if (!name || !password || balance === undefined) {
      return res
        .status(400)
        .json({ error: "Name, password, and balance are required." });
    }

    try {
      // Initialize Poseidon hash function
      const poseidon = await circomlibjs.buildPoseidon();

      // Generate serverHash using Poseidon
      const serverHash = poseidon.F.toString(poseidon([balance]));

      // Create a new user with the hashed balance (serverHash)
      const newUser = new User({
        name,
        password,
        balance: serverHash, // Store original balance
        type,
      });

      console.log(balance);

      await newUser.save();

      res.json({ message: "User created successfully!", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user." });
    }
  }
);

// Fetch all users (admin only)
router.get(
  "/admin/users",
  authenticateUser,
  authenticateAdmin,
  async (req, res) => {
    try {
      // const users = await User.find().select("-password");
      const users = await User.find();
      const formattedUsers = users.map((user) => user.toObject());
      res.status(200).json({ success: true, formattedUsers });
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch users!" });
    }
  }
);

// Delete user by ID (admin only)
router.delete(
  "/admin/users/:id",
  authenticateUser,
  authenticateAdmin,
  async (req, res) => {
    try {
      const userId = req.params.id;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });
      }

      // Delete the user
      await User.findByIdAndDelete(userId);
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully!" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete user!" });
    }
  }
);

// User login
router.post("/user/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name: name });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }
    if (password !== user.password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password!" });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        balance: user.balance,
        type: user.type,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(500).json({ success: false, message: "Login failed!" });
  }
});

// User logout
router.post("/user/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful!" });
  } catch (error) {
    console.error("Error in logout: ", error);
    res.status(500).json({ success: false, message: "Logout failed!" });
  }
});

// Authenticate user and fetch their information
router.get("/user/authenticate", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user_id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        balance: user.balance,
        type: user.type,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user!" });
  }
});

router.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.find({ userID: req.params.id });
    console.log(transaction);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Không thể lấy thông tin người dùng" });
  }
});

module.exports = router;
