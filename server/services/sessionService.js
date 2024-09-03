// server/services/sessionService.js
const updateUserSessions = async (user, sessions) => {
    user.sessions = sessions;
    await user.save();
};

const clearUserSessionById = (user, sessionId) => {
    const initialSessionCount = user.sessions.length;
    user.sessions = user.sessions.filter(session => session._id.toString() !== sessionId);
    return initialSessionCount !== user.sessions.length; // returns true if a session was removed
};

module.exports = { updateUserSessions, clearUserSessionById };
