const express = require('express');
const router = express.Router();
const UserData = require('../models/userData');

// POST /api/user - Create or update user data based on email
router.post('/user', async (req, res) => {
    const { email, username, profilePic, total_flight_time, highest_altitude, total_distance, top_speed } = req.body;

    try {
        let user = await UserData.findOne({ email });

        if (user) {
            // Update existing user
            user.username = username;
            user.profilePic = profilePic;
            user.total_flight_time = total_flight_time;
            user.highest_altitude = highest_altitude;
            user.total_distance = total_distance;
            user.top_speed = top_speed;
        } else {
            // Create new user
            user = new UserData({ email, username, profilePic, total_flight_time, highest_altitude, total_distance, top_speed });
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET /api/user/:email - Fetch user data by email
router.get('/user/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const user = await UserData.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// DELETE /api/user/:email - Delete user by email
router.delete('/user/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const deletedUser = await UserData.findOneAndDelete({ email });

        if (!deletedUser) {
        return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Server error');
    }
});

// PUT /api/user/username - Update user's username
router.put('/user/username', async (req, res) => {
    const { email, newUsername } = req.body;

    if (!email || !newUsername) {
        return res.status(400).json({ msg: 'Email and new username are required' });
    }

    try {
        const user = await UserData.findOneAndUpdate(
        { email },
        { username: newUsername },
        { new: true }
        );

        if (!user) {
        return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: 'Username updated successfully', user });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
