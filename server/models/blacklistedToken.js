// server/models/blacklistedToken.js

const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
