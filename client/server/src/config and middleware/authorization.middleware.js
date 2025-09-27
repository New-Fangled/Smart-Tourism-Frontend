import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req,res,next) => {
    try {
        const Token = req.cookies?.accessToken 
                       || 
        req.headers.authorization?.replace('Bearer ', '')

    if(!Token) {
        return res.status(401)
        .json({
            message:"You are not authorized to access this resource"
        })
    }

    const decodedToken =  jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET)
    
     const user = await User.findById(decodedToken._id).select('-password -refreshToken')

    if(!user) {
        return res.status(401)
        .json({
            message:"You are not a valid user"
        })
    }

    req.user = user;
    next();
    } catch (error) {
        return res.status(401).
        json({
            message: error?.message || "access denied, invalid token"
        })
    }
}

export const authorization = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be set by verifyJWT middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Access denied, user not authenticated" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};