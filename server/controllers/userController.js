// server/controllers/userController.js

const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const crypto = require('crypto'); // For generating the verification token
const nodemailer = require('nodemailer');
const { setHttpOnlyCookie } = require('../middleware/cookieHandler');
const BlacklistedToken = require('../models/blacklistedToken');
const blacklistToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000); // JWT exp is in seconds
    await BlacklistedToken.create({ token, expiresAt });
};

//registerUser
//verifyEmail
//loginUser
//getUserProfile
//logoutCurrentSession
//logoutAllSessions
//refreshToken


// Define the sendVerificationEmail function outside but near your registerUser function
const sendVerificationEmail = async (user, req) => {
    const transporter = nodemailer.createTransport({
        // Example using Gmail; replace with your SMTP settings
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const verificationUrl = `${req.protocol}://${req.get('host')}/user/verify/${user.verificationToken}`; 

    await transporter.sendMail({
        from: '"Lunar Praxis" <no-reply@lunarpraxis.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Please verify your email address', // Subject line
        html: `<p>Thank you for registering with lunar praxis! Please click the following link to verify your email address:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`, // html body
    });
};


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

        // Check if the token has expired
        const tokenAge = new Date() - user.verificationTokenTimestamp;
        const tokenExpirationDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (tokenAge > tokenExpirationDuration) {
            return res.status(400).send('Verification link has expired.');
        }

        // Update the user's email verification status and clear the verification token and its timestamp
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenTimestamp = undefined; // Clear the timestamp

        // Create a new token for the user session upon email verification
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '72h' });

        // Add the token to the user's sessions
        user.sessions.push({ token, createdAt: new Date() });
        
        await user.save();

        // Optionally, automatically log the user in by sending the token back to the user
        // In a real-world scenario, you might redirect the user to a logged-in page
        // and handle the token storage in a cookie or local storage in the frontend.
        res.status(200).send({
            message: 'Email verified successfully! You are now logged in.',
            token, // Send the token to the client
            // Provide any additional user info you see fit (excluding sensitive info like passwords)
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

        const accessToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ _id: user._id.toString() }, process.env.REFRESH_JWT_SECRET, { expiresIn: '7d' });

        user.refreshTokens.push({ token: refreshToken });
        await user.save();

        // Use the middleware function to set the refresh token as an HttpOnly cookie
        setHttpOnlyCookie(res, 'refreshToken', refreshToken, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds to match the refreshToken's expiration

        res.send({ accessToken }); // Send the access token in the response body
    } catch (error) {
        res.status(400).send({ error: 'Login failed' });
    }
};



exports.logoutCurrentSession = async (req, res) => {
    try {
        const sessionsBefore = req.user.sessions.length;
        const sessionId = req.body.sessionId; // Assuming the session ID comes from the request
        req.user.sessions = req.user.sessions.filter(session => session._id.toString() !== sessionId);
        
        await req.user.save(); // Save the user document after attempting to remove the session

        // Check if the session count has decreased, indicating a session was removed
        if (req.user.sessions.length < sessionsBefore) {
            // Clear the HttpOnly refresh token cookie as part of the logout process
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
        req.user.sessions = []; // Clear all sessions
        await req.user.save(); // Save the changes

        // Clear the HttpOnly refresh token cookie as part of the logout process
        clearHttpOnlyCookie(res, 'refreshToken');

        res.send({ message: 'Logged out from all sessions successfully' });
    } catch (error) {
        console.error("Error logging out from all sessions:", error);
        res.status(500).send({ error: 'Logout failed' });
    }
};



exports.refreshToken = async (req, res) => {
    // Access the refresh token directly from cookies
    const refreshToken = req.cookies.refreshToken;
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            'refreshTokens.token': refreshToken
        });

        if (!user) {
            return res.status(401).send({ error: 'Refresh token is invalid or expired.' });
        }

        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
        const newRefreshToken = jwt.sign({ _id: user._id.toString() }, process.env.REFRESH_JWT_SECRET, { expiresIn: '7d' });
        user.refreshTokens.push({ token: newRefreshToken });
        await user.save();

        const newAccessToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Optionally rotate the refresh token by setting a new one in an HttpOnly cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.send({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate using a valid refresh token.' });
    }
};
