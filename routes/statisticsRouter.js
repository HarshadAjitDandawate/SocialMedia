const express = require('express');
const router = express.Router();
const isLoggedin = require('../middleware/isLoggedin')
const statisticsData = require('../utils/data'); 

router.get('/',isLoggedin,(req,res)=>{
    res.render('statistics', { statisticsData });
})


router.get('/:page',isLoggedin,(req,res)=>{
    const page = req.params.page;
    const reqPages = ['normal-distribution', 'binomial-distribution' , 'central-limit-theorem'];
    if (reqPages.includes(page)) {
        res.render(`statistics_pages/${page}`);
    } else {
        res.status(404).render('pages/404');
    }

})



module.exports = router;