import { Router } from "express";
import { verifyJwt, isAuthorized } from "../middleware/auth.middleware.js";
import { addToCommittee, removeFromCommittee, getCommitteInfo } from "../controllers/messCommittee.controller.js";
const router = Router()



router.put("/add-to-committee", verifyJwt, isAuthorized(["Chief-Warden"]), addToCommittee);
router.put("/remove-from-committee", verifyJwt, isAuthorized(["Chief-Warden"]), removeFromCommittee);
router.get("/get-committee-info", verifyJwt, isAuthorized(["Chief-Warden"]), getCommitteInfo)
export default router;