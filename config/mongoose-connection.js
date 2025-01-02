require('dotenv').config();
const mongoose = require('mongoose');
const dbgr = require('debug')("development:mongoose");
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        dbgr("Connected to MongoDB");
    })
    .catch((err) => {
        dbgr("MongoDB connection error:", err.message);
    });

module.exports = mongoose.connection;