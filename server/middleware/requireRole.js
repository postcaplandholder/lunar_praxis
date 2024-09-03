// server/middleware/requireRole.js

const requireRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.type)) {
        return res.status(403).send({ error: 'You do not have permission to perform this action.' });
    }
    next();
};

module.exports = requireRole;
