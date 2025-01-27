import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

dotenv.config({
  path: '../.env',
});
// import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

//auth

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    console.log("before token extraction");
    console.log("request", req.header);

    //extract token
    const token =
      req.cookies?.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    console.log("after token extraction");
    //if token is missing return res
    if (!token) {
      throw new ApiError(401, "Token is missing")
    }
    //verify the token

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); //will return the decoded obj
    console.log("Decoded token is : ", decodedToken);

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Token")
    }

    console.log("success")
    req.user = decodedToken; 
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
});
