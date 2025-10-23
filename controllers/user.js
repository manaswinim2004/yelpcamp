
const User=require('../models/user.js')

module.exports.showRegistrationForm=(req,res)=>{

    res.render('register');
}

module.exports.registerUser=async(req,res,next)=>{

    try{

    const {username,email,password}=req.body;

    const user=new User({username,email});
    const registerUser=await User.register(user,password);
req.login(registerUser,err=>{
    if(err){
        return next(err);
    }
    req.flash('success','welcome to yelpcamp');
res.redirect('/campgrounds');

})
    }
    catch(e){
        req.flash('error',e.message);

res.redirect('register');

    }
}



module.exports.showLoginForm=(req,res)=>{
res.render('login');
}


module.exports.loginUser=(req,res)=>{
req.flash('success','welcome back!')
const redirectUrl=req.session.storeReturnTo||'/campgrounds';
delete req.session.storeReturnTo;
res.redirect(redirectUrl);

} 

module.exports.logoutUser=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}