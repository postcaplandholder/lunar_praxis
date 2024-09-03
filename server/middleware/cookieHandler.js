// server/middleware/cookieHandler.js

// Function to set a refresh token in an HttpOnly cookie directly
exports.setHttpOnlyCookie = (res, cookieName, tokenValue, maxAge) => {
    res.cookie(cookieName, tokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // CSRF protection
        path: '/',
        maxAge: maxAge, // Example: 7 days in milliseconds
    });
};

// Function to clear an HttpOnly cookie by name
exports.clearHttpOnlyCookie = (res, cookieName) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // CSRF protection
        path: '/',
    });
};
