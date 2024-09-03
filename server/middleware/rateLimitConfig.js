// server/middleware/rateLimitConfig.js

const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 login requests per window
    handler: (req, res) => {
        console.log(`Rate limit exceeded for ${req.ip} on path ${req.path}`);
        res.status(429).json({
            error: "Too many requests",
            message: "Too many login attempts from this IP, please try again after 15 minutes"
        });
    }
});
