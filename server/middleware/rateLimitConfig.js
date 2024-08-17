// middleware/rateLimitConfig.js

const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 login requests per window
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});
