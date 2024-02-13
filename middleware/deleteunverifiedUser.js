// Import necessary modules
import { User } from '../models/userModel.js';

// Middleware function to automatically delete unverified users every 1 minute
const deleteUnverifiedUsersPeriodically = () => {
    setInterval(async () => {
        try {
            // Find unverified users
            const unverifiedUsers = await User.find({ isVerified: false });

            // Delete unverified users
            await User.deleteMany({ _id: { $in: unverifiedUsers.map(user => user._id) } });
        } catch (error) {
            console.error('Error deleting unverified users:', error);
        }
    },30*60 * 1000); // 30 minute in milliseconds
};

export default deleteUnverifiedUsersPeriodically;
