
const express=require('express')
const catchAsync=require('../utils/catchAsync.js')
const router=express.Router()
const passport = require('passport')
const { showRegistrationForm, registerUser, showLoginForm, loginUser, logoutUser } = require('../controllers/user.js')

router.get('/register',showRegistrationForm);

router.post('/register',catchAsync(registerUser))


router.get('/login',showLoginForm)

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login' }) ,loginUser)


router.get('/logout', logoutUser); 

module.exports=router