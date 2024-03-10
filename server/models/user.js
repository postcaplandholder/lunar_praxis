// server/models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Ensure you've installed uuid package

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, default: () => uuidv4() },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // Store information about each user's active sessions... 
  // ...adding an array to store tokens and session metadata
  sessions: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    // Additional metadata fields as needed, e.g., device info, IP address
  }]
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  });

// Static method to find user by credentials
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Unable to login');
    }
    return user;
  };

  userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
  
    delete userObject.password; // Remove the password property
  
    return userObject;
  };



const User = mongoose.model('User', userSchema);

module.exports = User;
