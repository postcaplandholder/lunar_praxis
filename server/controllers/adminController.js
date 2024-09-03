// server/controllers/adminController.js

const User = require('../models/user'); 
const Topic = require('../models/topic'); 

//performCleanup
//changeUserRole


//delete all documents from relevant collections
async function cleanupTestData() {
    await User.deleteMany({}); // Deletes all users
    await Topic.deleteMany({}); // Deletes all topics
    console.log("Database cleared of test data.");
}
exports.performCleanup = async (req, res) => {
    try {
        await cleanupTestData(); // Call the actual cleanup function
        res.send({ message: 'Cleanup successful' });
    } catch (error) {
        console.error("Error during cleanup:", error);
        res.status(500).send({ error: 'Cleanup failed', details: error.message });
    }
};

exports.changeUserRole = async (req, res) => {
    try {
        const { email, newRole } = req.body; // Assuming the request body contains the email and new role
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { type: newRole } },
            { new: true, runValidators: true }
        );

        if (user) {
            res.status(200).json({ message: `User role updated for ${email}: now ${user.type}` });
        } else {
            res.status(404).send({ message: "User not found." });
        }
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).send({ error: "Error updating user role", details: error.message });
    }
};

