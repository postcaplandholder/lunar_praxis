// server/scripts/addUsers.js
require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');
const User = require('../models/user');

const usersToAdd = [
    { username: 'admin', email: 'admin@example.com', password: 'password123', type: 'Admin' },
    { username: 'user', email: 'user@example.com', password: 'password123', type: 'User' },
    // Add more users as needed
];

async function addUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB.");
        
        for (const userData of usersToAdd) {
            const user = new User(userData);
            await user.save();
            console.log(`User ${user.username} added.`);
        }
    } catch (error) {
        console.error("Error adding users:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

addUsers();
