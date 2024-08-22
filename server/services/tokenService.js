const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/blacklistedToken');

const generateToken = (id, secret, expiresIn) => {
    try {
        return jwt.sign({ _id: id.toString() }, secret, { expiresIn });
    } catch (error) {
        console.error('Token generation failed:', error);
        throw new Error('Token generation failed');
    }
};

const blacklistToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiresAt = new Date(decoded.exp * 1000);
        await BlacklistedToken.create({ token, expiresAt });
    } catch (error) {
        console.error('Failed to blacklist token:', error);
        throw new Error('Token invalidation failed');
    }
};

const checkTokenExpiration = (timestamp, duration) => {
    const tokenAge = new Date() - timestamp;
    return tokenAge > duration;
};

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error('Token verification failed');
    }
};

const refreshTokens = (user, refreshToken, secret, expiresIn) => {
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    const newRefreshToken = jwt.sign({ _id: user._id.toString() }, secret, { expiresIn });
    user.refreshTokens.push({ token: newRefreshToken });
    return newRefreshToken;
};

module.exports = { generateToken, blacklistToken, verifyToken, refreshTokens, checkTokenExpiration };