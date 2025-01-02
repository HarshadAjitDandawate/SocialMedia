const express = require('express');
const router = express.Router();
const Post = require('../models/post-model');
const isLoggedIn = require('../middleware/isLoggedin');

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find().populate('user'); 
    res.render('community', { posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
