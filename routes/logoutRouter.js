const express = require('express');
const router = express.Router();
const {logoutUser} = require('../controllers/authController');
const isLoggedin = require('../middleware/isLoggedin');

router.get('/',isLoggedin,logoutUser());

module.exports = router;