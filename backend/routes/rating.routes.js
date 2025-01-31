import { Router } from "express"
const router = Router();


import { isAuthorized, verifyJwt } from "../middleware/auth.middleware.js";
import { createRating, calculateAvgRating } from "../controllers/rating.controller.js";


router.post('/create-rating', verifyJwt, isAuthorized(["Student"]), createRating);
router.get('/get-avg-rating-mealwise', verifyJwt, isAuthorized(["Student"]), calculateAvgRating);

export default router;