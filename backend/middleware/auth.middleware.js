import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

dotenv.config({
  path: '../.env',
});
// import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

//auth

const verifyJwt = asyncHandler(async (req, res, next) => {
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
    req.user = decodedToken; //so that we can use it in isStudent and isAdmin middleware to verify
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
});

// const isStudent = asyncHandler(async (req, res, next) => {

//   if (req.user.accountCategory !== "Student") {
//     throw new ApiError(401, "This is a protected route authorized for Student only")
//   }

//   next();
// });

// const isChiefWarden = asyncHandler(async (req, res, next) => {

//   if (req.user.accountCategory !== "Chief-Warden") {
//     throw new ApiError(401, "This is a protected route authorized for Chief Warden only")
//   }

//   next();
// });

// const isCommitteeMember = asyncHandler(async (req, res, next) => {

//   if (req.user.accountCategory !== "Mess-Committee-Member") {
//     throw new ApiError(401, "This is a protected route authorized for Committee Member only")
//   }

//   next();
// });

// const isAccountant = asyncHandler(async (req, res, next) => {

//   if (req.user.accountCategory !== "Accountant") {
//     throw new ApiError(401, "This is a protected route authorized for Accountant only")
//   }

//   next();
// });

// const isNotStudent = asyncHandler(async (req, res, next) => {

//   if (req.user.accountCategory === "Student") {
//     throw new ApiError(401, "Student can't edit these details")
//   }

//   next();
// });

// const isWardenOrIsAccountant = asyncHandler(async (req, res, next) => {

//   const userCategory = req.user.accountCategory

//   if (userCategory !== "Chief-Warden" && userCategory !== "Accountant") {
//     throw new ApiError(401, "This is a protected route authorized for Accountant and Chief Warden only")
//   }

//   next();
// });

const isAuthorized = (allowedRoles) => asyncHandler(async (req, res, next) => {
  if (!allowedRoles.includes(req.user.accountCategory)) {
    throw new ApiError(401, "Unauthorized access");
  }
  next();
});


// export { verifyJwt, isChiefWarden, isCommitteeMember, isAccountant, isNotStudent, isStudent, isWardenOrIsAccountant, isAuthorized }

export { verifyJwt, isAuthorized }