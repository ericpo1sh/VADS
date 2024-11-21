const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
    },
    total_flight_time: {
        type: Number,
        default: 0
    },
    highest_altitude: {
        type: Number,
        default: 0
    },
    total_distance: {
        type: Number,
        default: 0
    },
    top_speed: {
        type: Number,
        default: 0
    }
}, {
    collection: 'user_data'
});

module.exports = mongoose.model('UserData', UserDataSchema);
