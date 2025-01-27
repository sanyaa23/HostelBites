import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { updateProfile, getUserDetails, getUserByRegistrationNumber } from "../controllers/profile.controller.js";

const router = Router();

// Route for user getting user details
router.get("/get-user-details", verifyJwt, getUserDetails);

// Route for user profile updation
router.put("/update-profile", verifyJwt, updateProfile);

// Route for getting user profile by reg no
router.post("/get-user-by-registration", verifyJwt, getUserByRegistrationNumber);

export default router