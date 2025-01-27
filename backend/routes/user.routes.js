import { Router } from "express";
const router = Router();

import { signUp, login, sendOtp, updatePassword, resetPasswordToken , resetPassword} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// // Route for sending OTP to the user's email
router.post("/sendotp", sendOtp)

// // Route for Changing the password
router.put("/update-password", verifyJwt, updatePassword);

// // Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// // Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


export default router