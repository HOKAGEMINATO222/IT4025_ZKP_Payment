const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const snarkjs = require("snarkjs");
const connectDB = require("./config/db");
const authenticationRoutes = require("./routes/authentication");
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
app.post("/payment", async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;
    const isValid = await snarkjs.groth16.verify(
      verificationKey,
      publicSignals,
      proof
    );
    res.json({ isValid });
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
