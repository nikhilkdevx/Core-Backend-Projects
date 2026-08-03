const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");

module.exports = (req,res,next) =>{
    try{
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ExpressError(401, "Unauthorized");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECERT);
        req.user = decoded;
        
        next();
    } catch(err){
         if(err.name === "TokenExpiredError"){
        throw new ExpressError(401,"Token expired");
        }

        if(err.name === "JsonWebTokenError"){
        throw new ExpressError(401,"Invalid token");
        }

        throw err;
    }
    

}