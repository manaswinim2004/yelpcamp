const express=require('express');
const router =express.Router();
const catchAsync = require("../utils/catchAsync");
const {isAuthor,validateCampground,isLoggedIn}=require('../middlewares.js');
const { allCampground, addCampground, showNewForm, showOneCampground, showEditForm, editCampground, deleteCampground } = require('../controllers/campgrounds.js');
const multer=require('multer')
const {storage}=require('../cloudniary');
const upload=multer({storage});


router.get("/",allCampground);


router.get("/new", isLoggedIn,showNewForm); 

router.post("/",isLoggedIn,upload.array('image'),validateCampground,catchAsync( addCampground));

router.get("/:id",showOneCampground);



router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(showEditForm));

router.put("/:id",isLoggedIn,isAuthor,upload.array('image'), validateCampground,catchAsync(editCampground));


router.delete("/:id",isLoggedIn,isAuthor,deleteCampground);


module.exports=router