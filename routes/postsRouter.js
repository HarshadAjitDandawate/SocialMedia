const express = require('express');
const router = express.Router();
const isLoggedin = require('../middleware/isLoggedin')
const User = require('../models/user-model');
const Post = require('../models/post-model');

router.get('/', isLoggedin, async (req, res) => {
    try {
      const userPosts = await Post.find({ user: req.user._id }).populate('user');
      res.render('posts', { posts: userPosts });
      console.log(userPosts);
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

router.post('/', isLoggedin, async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const newPost = new Post({
            title: title,
            description: description,
            tags: tags.split(',').map(tag => tag.trim()),
            user: req.user._id
        });

        await newPost.save();

        await User.findByIdAndUpdate(req.user._id, { $push: { posts: newPost._id } });

        req.flash('success', 'Post created successfully');
        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while creating the post');
        res.redirect('/posts');
    }
});

router.post('/:id/delete', isLoggedin, async (req, res) => {
    try {
        await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        req.flash('success', 'Post deleted successfully');
        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while deleting the post');
        res.redirect('/posts');
    }
});

module.exports = router;
