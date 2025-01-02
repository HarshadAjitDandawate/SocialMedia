const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateTokens');

module.exports.registerUser = () =>async (req, res) => {
  try {

    let { fullname, email, username, password } = req.body;
    console.log(fullname, email, username, password);
    let existingUser = await userModel.findOne({ username: username });
    if (existingUser) {
      req.flash('error','Username already exists.')
      return  res.status(400).redirect("/register");
    }
    
    let existingEmail = await userModel.findOne({ email: email });
    if (existingEmail) {
      req.flash('error','Email is already registered.')
      return  res.status(400).redirect("/register");
    }


    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.send(err.message);
        } else {
          let user = await userModel.create({
            name: fullname,
            username: username,
            email: email,
            password: hash,
          });

          let token = generateToken(user);
          res.cookie("token", token);
          req.flash("success","User created Successfully");
          res.redirect('/login');
        }
      });
    });
  } catch (err) {
    console.log(err.message);
  }
};


module.exports.loginUser = () => async (req, res) => {
  let {email, password} = req.body;
  let user = await userModel.findOne({ email: email });

  if (!user) {
    req.flash('error','Incorrect Email or Password');
    return res.redirect('/login'); 
  }
  
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      req.flash('error', 'An error occurred during login');
      return res.redirect('/login');
    }
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      req.flash('success', 'Logged in successfully');
      res.redirect("/statistics");
    } else {
      req.flash('error','Incorrect Email or Password');
      res.redirect('/login');
    }
  });
}

module.exports.logoutUser = ()=>(req,res)=>{
  res.clearCookie('token');
  req.flash('success', 'Logged out successfully');
  res.redirect('/');
}


