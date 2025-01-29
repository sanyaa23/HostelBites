import { Router } from "express";
import { verifyJwt, isAuthorized } from "../middleware/auth.middleware.js";
import { updateProfile, getUserDetails, getUserByRegistrationNumber, deleteUserAccount, blockUserProfile, unblockUserProfile, markFeeStatusAsTrue, markFeeStatusAsFalse } from "../controllers/profile.controller.js";

const router = Router();



router.get("/get-user-details", verifyJwt, getUserDetails);
router.put("/update-profile", verifyJwt, updateProfile);
router.post("/block-user", verifyJwt, isAuthorized(["Chief-Warden"]), blockUserProfile);
router.delete("/unblock-user", verifyJwt, isAuthorized(["Chief-Warden"]), unblockUserProfile);
router.delete("/delete-account", verifyJwt, deleteUserAccount);
router.post("/get-user-by-registration", verifyJwt, getUserByRegistrationNumber);
router.put("/mark-fee-paid-true", verifyJwt, isAuthorized(["Accountant"]), markFeeStatusAsTrue);
router.put("/mark-fee-paid-false", verifyJwt, isAuthorized(["Accountant"]), markFeeStatusAsFalse);
export default router
