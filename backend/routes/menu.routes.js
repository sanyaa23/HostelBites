import { Router } from "express";
const router = Router();

import { verifyJwt } from "../middleware/auth.middleware.js";
import { isAuthorized } from "../middleware/auth.middleware.js";
import { addMenu, viewMenu, editMenu } from "../controllers/menu.controller.js";


router.post("/add-menu", verifyJwt, isAuthorized(["Chief-Warden", "Accountant", "Mess-Committee-Member"]), addMenu);
router.put("/edit-menu", verifyJwt, isAuthorized(["Chief-Warden", "Accountant", "Mess-Committee-Member"]), editMenu);
router.get("/view-menu", verifyJwt, viewMenu);

export default router;