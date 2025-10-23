
const express=require('express');
const router =express.Router({mergeParams:true});

const catchAsync = require("../utils/catchAsync");
 
const {validateReview,isLoggedIn}=require('../middlewares');
const { addReview, deleteReview } = require('../controllers/review');

router.post("/",isLoggedIn,validateReview,catchAsync(addReview));

router.delete('/:reviewId',isLoggedIn,catchAsync(deleteReview))

module.exports=router