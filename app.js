const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require("./config/mongoose-connection");
require('dotenv').config();
const expressSession = require("express-session");
const flash = require("connect-flash");

 
const homeRouter = require('./routes/homeRouter');
const registerRouter = require('./routes/registerRouter')
const logoinRouter = require('./routes/loginRouter');
const logoutRouter = require('./routes/logoutRouter');
const communityRouter = require('./routes/communityRouter');
const postsRouter = require('./routes/postsRouter');
const quickReportRouter  = require('./routes/quickReportRouter');
const customDataRouter = require('./routes/customDataRouter');
const statisticsRouter = require('./routes/statisticsRouter');

const app = express();

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.use(expressSession({
        resave : false,
        saveUninitialized : false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', homeRouter);
app.use('/register',registerRouter);
app.use('/login',logoinRouter);
app.use('/logout', logoutRouter);
app.use('/community', communityRouter);
app.use('/posts', postsRouter);
app.use('/quick-report', quickReportRouter);
app.use('/custom-data',customDataRouter)
app.use('/statistics', statisticsRouter);

const Port = process.env.PORT || 3000;
app.listen(Port)