// server/scripts/updateAdmin.js

require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');
const User = require('../models/user'); 

async function updateAdminUsername() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB.");

        // Find the admin user and update the username
        const result = await User.findOneAndUpdate(
            { username: 'admin', type: 'Admin' }, // Find a user with username 'admin' and type 'Admin'
            { $set: { username: 'lunar1' } }, // Update username to 'lunar1'
            {
                new: true, // Return the updated document
                runValidators: true // Run model validators on update
            }
        );

        if (result) {
            console.log(`Admin username updated: ${result.username}`);
        } else {
            console.log("Admin user not found or update not required.");
        }
    } catch (error) {
        console.error("Error updating admin username:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

updateAdminUsername();
