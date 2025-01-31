const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    reports: [{
        type: Schema.Types.ObjectId,
        ref: 'Report'
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);