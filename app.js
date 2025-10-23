if(process.env.NODE_ENV!='production'){
  require('dotenv').config();
}

const sanitizeV5 = require('./utils/mongoSanitizeV5.js');

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
app.set('query parser', 'extended');
const secret = process.env.SECRET;
const dburl=process.env.DB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const expressSession=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/user.js')
const userRoutes=require('./routes/user')
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
const reviewRoutes=require('./routes/reviews.js')
const mongoDBStore=require('connect-mongo')(expressSession);
const campgroundRoutes=require('./routes/campgrounds')

// Connect to MongoDB
mongoose.connect(dburl)
  .then(() => console.log("Database connected"))
  .catch(err => console.log("Connection error:", err));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname,'public')))
app.use(sanitizeV5({ replaceWith: '_' }));


const store=new mongoDBStore({
  url:dburl,
  secret,
  touchAfter:24*60*60
});


store.on('error',function(e){
  console.log('session store error',e);
});

const sessionConfig={
  store,
  name:'session',
  secret,
  resave:false, 
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    // secure:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}

app.use(expressSession(sessionConfig))


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
  res.locals.currentUser=req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/',userRoutes)

app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.use('/',(req,res)=>{
  res.render('home');
})

app.all(/(.*)/, (req, res, next) => {  
  next(new ExpressError("Page Not Found ",404));
});

app.use((err,req,res,next)=>{
  const {statusCode=500}=err;
  if(!err.message) err.message="Something went wrong";
  res.render("error",{err});
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
