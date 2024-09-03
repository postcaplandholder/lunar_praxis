// server/scripts/deleteUsers.js
require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');
const User = require('../models/user');

async function deleteUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB.");
        
        const result = await User.deleteMany({});
        console.log(`Users deleted: ${result.deletedCount}`);
    } catch (error) {
        console.error("Error deleting users:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

deleteUsers();
