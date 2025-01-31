import { Router } from "express"
const router = Router();

//import middleware ->
import { verifyJwt, isAuthorized } from "../middleware/auth.middleware.js";

//import controllers
import { addExpense, editExpense, getExpenseById, getExpenseInfo, deleteExpense, getTotalExpense, getExpenseByItemName, getExpenseInDateRange, getExpenseByItemCategory, getExpenseInDateRangeByItemCategory, getExpenseInDateRangeByItemName } from "../controllers/expense.controller.js";


//import controllers
router.post("/add-daily-expense", verifyJwt, isAuthorized(["Accountant"]), addExpense);
router.put("/edit-daily-expense/:expenseId", verifyJwt, isAuthorized(["Accountant"]), editExpense);
router.get("/get-expense-by-id/:expenseId", verifyJwt, isAuthorized(["Accountant"]), getExpenseById);
router.get("/get-expense-by-hostel", verifyJwt, isAuthorized(["Accountant"]), getExpenseInfo);
router.delete("/delete-expense/:expenseId", verifyJwt, isAuthorized(["Accountant"]), deleteExpense);
router.get("/get-total-expense", verifyJwt, isAuthorized(["Accountant"]), getTotalExpense);
router.get("/get-expense-by-itemname", verifyJwt, isAuthorized(["Accountant"]), getExpenseByItemName);
router.get("/get-expense-in-daterange", verifyJwt, isAuthorized(["Accountant"]), getExpenseInDateRange);
router.get("/get-expense-by-itemcategory", verifyJwt, isAuthorized(["Accountant"]), getExpenseByItemCategory);
router.get("/get-expense-in-daterange-by-itemcategory", verifyJwt, isAuthorized(["Accountant"]), getExpenseInDateRangeByItemCategory);
router.get("/get-expense-in-daterange-by-itemname", verifyJwt, isAuthorized(["Accountant"]), getExpenseInDateRangeByItemName);


export default router;