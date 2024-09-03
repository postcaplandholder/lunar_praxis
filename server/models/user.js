// server/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Defines the schema for a user session. Each session includes a unique session ID, a token for authentication, 
// and a timestamp indicating when the session was created. The sessionId defaults to a UUID for uniqueness.
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, default: () => uuidv4() }, // Unique session identifier
  token: { type: String, required: true }, // Authentication token
  createdAt: { type: Date, default: Date.now }, // Timestamp of session creation
});

// Defines the schema for user accounts. This includes the user's username, email, password, user type (role), 
// and creation timestamp. The user type is restricted to 'Admin', 'User', or 'Guest', with 'User' as the default.
// The sessions array embeds sessionSchema documents directly, allowing each user to have multiple active sessions.
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Must be unique
  email: { type: String, required: true, unique: true }, // Must be unique
  password: { type: String, required: true }, // Encrypted password
  type: { type: String, required: true, default: 'User', enum: ['Admin', 'Decider', 'Guest'] }, // User role
  createdAt: { type: Date, default: Date.now }, // Timestamp of account creation
  sessions: [sessionSchema], // Array of embedded session documents
  emailVerified: { type: Boolean, default: false }, //For user registration
  verificationToken: { type: String, required: false }, //For user registration
  verificationTokenTimestamp: { type: Date }, //For token expiration for email verification tokens
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  refreshTokens: [{
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
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
// Constants for lockout policy
const MAX_LOGIN_ATTEMPTS = 10; // Maximum failed attempts before lockout
const LOCK_TIME = 2 * 60 * 60 * 1000; // Lockout time in milliseconds (e.g., 2 hours)

userSchema.statics.findByCredentials = async function(username, password) {
  const user = await this.findOne({ username });

  // Check if the account is currently locked
  if (user && user.lockUntil && user.lockUntil > Date.now()) {
    throw new Error('Your account is locked due to multiple failed login attempts. Please try again later.');
  }

  if (!user) {
    throw new Error('Unable to login. Please check your credentials and try again.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // Increment login attempts and potentially lock the account
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
    }
    await user.save(); // Save the updated user document
    throw new Error('Unable to login. Please check your credentials and try again.');
  }

  // Reset login attempts and unlock the account on successful login
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  return user;
};



// Exclude password and sessions.token from user object
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password; // Remove the password property
  userObject.sessions.forEach(session => delete session.token); // Remove tokens from sessions

  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
