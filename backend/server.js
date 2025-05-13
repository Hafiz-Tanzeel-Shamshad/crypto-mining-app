require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Web3 } = require("web3");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// JWT Generator
const generateToken = (walletAddress) => {
  return jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ======================= AUTH =======================
app.post("/api/auth", async (req, res) => {
  const { walletAddress, signature, referralCode } = req.body;
  if (!walletAddress || !signature) {
    return res.status(400).json({ message: "Wallet address and signature required" });
  }

  try {
    const web3 = new Web3();
    const message = "Please sign this message to authenticate with our service";
    const recovered = web3.eth.accounts.recover(message, signature);
    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ message: "Signature verification failed" });
    }

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    const now = new Date();

    if (!user) {
      user = new User({ walletAddress: walletAddress.toLowerCase(), firstLoginTime: now, lastLoginTime: now });

      if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer && referrer.walletAddress !== walletAddress.toLowerCase()) {
          user.referredBy = referrer._id;
          referrer.referrals.push(user._id);
          referrer.referralPoints += 3000;
          referrer.totalPoints += 3000;
          await referrer.save();
        }
      }

      await user.save();
    } else {
      user.lastLoginTime = now;
      await user.save();
    }
   
    const token = generateToken(user.walletAddress);
    res.json({ success: true, token, id : user._id, walletAddress: user.walletAddress});
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ======================= DASHBOARD =======================

// Update mining progress endpoint - adds random points (50-100) every minute
app.post("/api/dashboard/update-mining-progress", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      walletAddress: req.user.walletAddress,
      miningStartTime: { $ne: null } // Only if mining is active
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No active mining session"
      });
    }

    const now = new Date();
    const lastUpdateTime = user.lastPointsUpdate || user.miningStartTime;
    const timeSinceLastUpdate = now - lastUpdateTime;
    const minutesSinceLastUpdate = timeSinceLastUpdate / (1000 * 60);
    const fullMinutesPassed = Math.floor(minutesSinceLastUpdate);

    const miningDuration = now - user.miningStartTime;
    const hoursMined = miningDuration / (1000 * 60 * 60);

    // If less than 1 minute passed and session isn't done, return without updating
    if (fullMinutesPassed < 1 && hoursMined < 24) {
      return res.json({
        success: true,
        pointsAdded: 0,
        currentPoints: user.currentPoints,
        totalPoints: user.totalPoints,
        miningStatus: 'active'
      });
    }

    let randomPoints = 0;

    if (fullMinutesPassed >= 1) {
      // Award points: 50–100 per minute
      const pointsPerMinute = () => Math.floor(Math.random() * 51) + 50;
      for (let i = 0; i < fullMinutesPassed; i++) {
        randomPoints += pointsPerMinute();
      }

      user.currentPoints += randomPoints;

      // Move last update time forward by the exact minutes passed
      user.lastPointsUpdate = new Date(lastUpdateTime.getTime() + fullMinutesPassed * 60000);
    }

    let miningStatus = 'active';

    // If 24h passed, finalize the session
    if (hoursMined >= 24) {
      user.totalPoints += user.currentPoints;
      user.currentPoints = 0;
      user.miningStartTime = null;
      user.lastPointsUpdate = null;
      miningStatus = 'completed';

      console.log(`Mining session completed for user ${user.walletAddress}`);
    }

    await user.save();

    return res.json({
      success: true,
      pointsAdded: randomPoints,
      currentPoints: user.currentPoints,
      totalPoints: user.totalPoints,
      miningStatus
    });

  } catch (error) {
    console.error("Mining progress error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Reset mining session after 24 hours
app.post("/api/dashboard/reset-mining-session", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add current points to total and reset current points
    user.totalPoints += user.currentPoints;
    user.currentPoints = 0;
    user.miningStartTime = null;
    await user.save();

    res.json({ 
      success: true,
      totalPoints: user.totalPoints,
      currentPoints: user.currentPoints
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start mining endpoint
app.post("/api/dashboard/start-mining", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    
    // If there's an existing session, finalize it first
    if (user.miningStartTime) {
      const elapsedMs = now - user.miningStartTime;
      const elapsedHours = elapsedMs / (1000 * 60 * 60);
      
      if (elapsedHours < 24) {
        return res.status(400).json({ 
          message: "Mining already active", 
          hoursRemaining: (24 - elapsedHours).toFixed(2) 
        });
      }
      
      // Add current points to total points for completed session
      user.totalPoints += user.currentPoints;
    }

    // Start new session
    user.miningStartTime = now;
    user.currentPoints = 0;
    user.lastPointsUpdate = now;
    await user.save();

    res.json({ 
      success: true,
      miningStartTime: user.miningStartTime,
      currentPoints: user.currentPoints,
      totalPoints: user.totalPoints
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user data
app.get("/api/dashboard/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Stop mining
app.post("/api/dashboard/stop-mining", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });
    if (!user || !user.miningStartTime) return res.status(400).json({ message: "No active mining session" });

    // Add current points to total
    user.totalPoints += user.currentPoints;
    user.currentPoints = 0;
    user.miningStartTime = null;
    user.totalMiningSessions += 1;
    await user.save();

    res.json({ 
      success: true, 
      totalPoints: user.totalPoints 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= REFERRALS ===================

// Validate Referral Code
app.get("/api/referral/validate/:code", async (req, res) => {
  try {
    const referrer = await User.findOne({ referralCode: req.params.code }).select("walletAddress referralCode");
    if (!referrer) return res.json({ valid: false });
    res.json({ valid: true, referrer });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Referral Stats
app.get("/api/dashboard/referral-stats", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress })
      .populate("referredBy", "walletAddress referralCode")
      .populate("referrals", "walletAddress createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      referralCode: user.referralCode,
      referralLink: user.referralLink,
      referralPoints: user.referralPoints,
      totalReferrals: user.referrals.length,
      referredBy: user.referredBy,
      referrals: user.referrals
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));