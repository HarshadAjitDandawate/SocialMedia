const express = require('express');
const isLoggedin = require('../middleware/isLoggedin');
const router = express.Router();

router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render('Home',{error});
});


module.exports = router;