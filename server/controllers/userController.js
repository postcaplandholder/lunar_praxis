// server/controllers/userController.js

// External libraries (Only those directly used in this file)
const crypto = require('crypto');

// Internal dependencies
const User = require('../models/user'); 
const { setHttpOnlyCookie } = require('../middleware/cookieHandler');
const { generateToken, checkTokenExpiration, verifyToken, refreshTokens } = require('../services/tokenService');
const { sendVerificationEmail } = require('../services/emailService');
const BlacklistedToken = require('../models/blacklistedToken');
const { updateUserSessions, clearUserSessionById } = require('../services/sessionService');


//registerUser
//verifyEmail
//loginUser
//getUserProfile
//logoutCurrentSession
//logoutAllSessions
//refreshToken


exports.registerUser = async (req, res) => {
    try {
        const newUser = new User(req.body);

        // Generate a verification token before saving the newUser
        newUser.verificationToken = crypto.randomBytes(20).toString('hex');
        newUser.verificationTokenTimestamp = new Date(); // Set the current timestamp

        // Save the newUser to generate an _id
        await newUser.save();

        // Call the sendVerificationEmail function after saving the newUser
        await sendVerificationEmail(newUser, req);

        // Send response back to client indicating that registration was successful
        // Note: Now we're not sending a session token or sessionId in the response
        // as the user hasn't verified their email yet.
        res.status(201).send({ user: newUser._id, message: "Registration successful. Please check your email to verify your account." });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).send('Invalid or expired verification link.');
        }

        // Check if the token has expired using the service
        if (checkTokenExpiration(user.verificationTokenTimestamp, 24 * 60 * 60 * 1000)) { // 24 hours in milliseconds
            return res.status(400).send('Verification link has expired.');
        }

        // Update the user's email verification status and clear the verification token and its timestamp
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenTimestamp = undefined;

        // Create a new token for the user session upon email verification
        const token = generateToken(user._id, process.env.JWT_SECRET, '72h');
        user.sessions.push({ token, createdAt: new Date() });
        await user.save();

        // Optionally, automatically log the user in by sending the token back to the user
        res.status(200).send({
            message: 'Email verified successfully! You are now logged in.',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);
        if (!user.emailVerified) {
            return res.status(403).send({ error: 'Please verify your email address first.' });
        }
        const accessToken = generateToken(user._id, process.env.JWT_SECRET, '15m');
        const refreshToken = generateToken(user._id, process.env.REFRESH_JWT_SECRET, '7d');
        user.refreshTokens.push({ token: refreshToken });
        await user.save();
        setHttpOnlyCookie(res, 'refreshToken', refreshToken, 7 * 24 * 60 * 60 * 1000);
        res.send({ accessToken });
    } catch (error) {
        res.status(400).send({ error: 'Login failed' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Assuming 'req.user' is already populated by the 'authenticate' middleware
        const user = await User.findById(req.user._id).select('-password'); // Exclude the password field
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    try {
        const decoded = verifyToken(refreshToken, process.env.REFRESH_JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            'refreshTokens.token': refreshToken
        });

        if (!user) {
            return res.status(401).send({ error: 'Refresh token is invalid or expired.' });
        }

        const newRefreshToken = refreshTokens(user, refreshToken, process.env.REFRESH_JWT_SECRET, '7d');
        await user.save();

        const newAccessToken = generateToken(user._id, process.env.JWT_SECRET, '15m');

        setHttpOnlyCookie(res, 'refreshToken', newRefreshToken, 7 * 24 * 60 * 60 * 1000); // Set the new HttpOnly cookie

        res.send({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate using a valid refresh token.' });
    }
};

exports.logoutCurrentSession = async (req, res) => {
    try {
        if (clearUserSessionById(req.user, req.body.sessionId)) {
            await updateUserSessions(req.user, req.user.sessions);
            clearHttpOnlyCookie(res, 'refreshToken');
            res.send({ message: 'Logged out from the current session successfully' });
        } else {
            res.status(404).send({ error: 'Session not found or already logged out' });
        }
    } catch (error) {
        console.error("Error logging out from the session:", error);
        res.status(500).send({ error: 'Logout failed' });
    }
};

exports.logoutAllSessions = async (req, res) => {
    try {
        await updateUserSessions(req.user, []); // Clear all sessions
        clearHttpOnlyCookie(res, 'refreshToken');
        res.send({ message: 'Logged out from all sessions successfully' });
    } catch (error) {
        console.error("Error logging out from all sessions:", error);
        res.status(500).send({ error: 'Logout failed' });
    }
};


