// server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');
const adminController = require('../controllers/adminController');

// Cleanup route for test data (included only in non-production environments)
if (process.env.NODE_ENV !== 'production') {
    router.delete('/cleanup', authenticate, requireRole(['Admin']), adminController.performCleanup);
}


router.patch('/changeUserRole', authenticate, requireRole(['Admin']), adminController.changeUserRole);


module.exports = router;
