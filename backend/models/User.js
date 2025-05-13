

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: props => `${props.value} is not a valid Ethereum address!`
    }
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  currentPoints: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  miningStartTime: {
    type: Date,
    default: null
  },
  referralCode: {
    type: String,
    unique: true,
    uppercase: true,
    minlength: 6,
    maxlength: 8
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastPointsUpdate: {
    type: Date,
    default: null
  },
  lastDailyReset: {  // New field to track last 24-hour reset
    type: Date,
    default: null
  },
  totalMiningSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  referralPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  miningHistory: [{  // New field to track mining sessions
    startTime: Date,
    endTime: Date,
    pointsEarned: Number
  }]
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

// Automatic referral code generation
UserSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }
  next();
});

// Method to add random points (50-100 range)
UserSchema.methods.addRandomPoints = async function() {
  const randomPoints = Math.floor(Math.random() * 51) + 50; // 50-100 range
  this.currentPoints += randomPoints;
  this.lastPointsUpdate = new Date();
  
  // Check if 24 hours have passed since last reset
  const now = new Date();
  if (this.lastDailyReset && (now - this.lastDailyReset) >= 24 * 60 * 60 * 1000) {
    this.totalPoints += this.currentPoints;
    
    // Record the mining session in history
    this.miningHistory.push({
      startTime: this.lastDailyReset,
      endTime: now,
      pointsEarned: this.currentPoints
    });
    
    this.currentPoints = 0;
    this.lastDailyReset = now;
  } else if (!this.lastDailyReset) {
    this.lastDailyReset = now;
  }
  
  await this.save();
  return randomPoints;
};

// Method to start mining session
UserSchema.methods.startMining = async function() {
  if (this.miningStartTime) {
    const now = new Date();
    const elapsedMs = now - this.miningStartTime;
    
    // If previous session was less than 12 hours ago, don't start new one
    if (elapsedMs < 12 * 60 * 60 * 1000) {
      throw new Error(`Mining already active. ${Math.floor((12*60*60*1000 - elapsedMs)/1000/60)} minutes remaining`);
    }
    
    // Finalize previous session
    const earnedPoints = Math.floor(elapsedMs / 1000 * 0.1);
    this.totalPoints += earnedPoints;
  }
  
  this.miningStartTime = new Date();
  this.currentPoints = 0;
  this.lastPointsUpdate = null;
  this.lastDailyReset = new Date();
  await this.save();
};

// Method to stop mining session
UserSchema.methods.stopMining = async function() {
  if (!this.miningStartTime) {
    throw new Error('No active mining session');
  }

  const now = new Date();
  const seconds = (now - this.miningStartTime) / 1000;
  const earnedPoints = Math.floor(seconds * 0.1);

  this.totalPoints += earnedPoints;
  this.currentPoints = 0;
  this.totalMiningSessions += 1;
  
  // Record the mining session
  this.miningHistory.push({
    startTime: this.miningStartTime,
    endTime: now,
    pointsEarned: earnedPoints
  });
  
  this.miningStartTime = null;
  this.lastPointsUpdate = null;
  await this.save();
  
  return earnedPoints;
};

// Virtual for referral link
UserSchema.virtual('referralLink').get(function() {
  return `${process.env.BASE_URL}/register?ref=${this.referralCode}`;
});

// Helper function
function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = mongoose.model('User', UserSchema);