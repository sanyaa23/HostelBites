import { Router } from "express";
const router = Router();

//import middleware 
import { verifyJwt, isAuthorized } from "../middleware/auth.middleware.js";


//import controllers
import { createComplaint, getAllComplaints, getComplaintById, getUnresolvedComplaints, getResolvedComplaints, myComplaints, deleteComplaints, upvoteComplaint, downvoteComplaint, resolveComplaint, getComplaintByMostUpvotes, getMostRecentComplaints } from "../controllers/complaint.controller.js";



router.post("/create-complaint", verifyJwt, isAuthorized(["Student"]), createComplaint);
router.get("/get-all-complaints", verifyJwt, getAllComplaints);
router.get("/get-resolved-complaints", verifyJwt, getResolvedComplaints);
router.get("/get-unresolved-complaints", verifyJwt, getUnresolvedComplaints);
router.get("/my-complaints", verifyJwt, myComplaints);
router.get("/get-complaint-by-id/:complaintId", verifyJwt, getComplaintById);
router.delete("/delete-complaint/:complaintId", verifyJwt, deleteComplaints);
router.put("/upvote-complaint/:complaintId", verifyJwt, isAuthorized(["Student"]), upvoteComplaint);
router.put("/downvote-complaint/:complaintId", verifyJwt, isAuthorized(["Student"]), downvoteComplaint);
router.put("/resolve-complaint/:complaintId", verifyJwt, isAuthorized(["Mess-Committee-Member", "Chief-Warden", "Accountant"]), resolveComplaint);
router.get("/get-by-most-votes", verifyJwt, getComplaintByMostUpvotes);
router.get("/get-most-recent-complaints", verifyJwt, getMostRecentComplaints);




export default router;