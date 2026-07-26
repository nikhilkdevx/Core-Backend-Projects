function isLoggedIn(req,res,next){
    if(!req.session.user){
        throw new ExpressError(401,"Please Login");
    }
    next();
}

module.exports = isLoggedIn;