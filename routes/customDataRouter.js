const express = require('express');
const isLoggedin = require('../middleware/isLoggedin');
const router = express.Router();

router.get('/',isLoggedin ,(req, res) => {
    res.render('pages/upload');
});


router.get('/:page',isLoggedin,(req, res) => {
    const page = req.params.page;
    const reqPages = ['scatterplot', 'multilinechart', 'boxplot' , 'histogram'];
    if (reqPages.includes(page)) {
        res.render(`pages/${page}`);
    } else {
        res.status(404).render('pages/404');
    }
})

module.exports = router;