//--Authentication and authorization
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

//----Check if the token is there
const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  //--Read JWT from 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //--get the user
      req.user = await User.findById(decoded.userId).select("-password");
      
      //--Go to the next method after completing above
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed!");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token!");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizeAdmin };
