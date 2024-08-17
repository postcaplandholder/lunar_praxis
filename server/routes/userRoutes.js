// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { loginLimiter } = require('../middleware/rateLimitConfig');

const {
  registerUser,
  loginUser,
  getUserProfile,
  logoutCurrentSession,
  logoutAllSessions,
  refreshToken,
  verifyEmail
} = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/verify/:token', verifyEmail);  
router.post('/login', loginLimiter, loginUser);  
router.get('/user/profile', authenticate, getUserProfile);
router.post('/logout', authenticate, logoutCurrentSession);
router.post('/logoutAll', authenticate, logoutAllSessions);
router.post('/refresh-token', refreshToken);  

module.exports = router;
