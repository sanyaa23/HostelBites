import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const addExpense = asyncHandler(async (req, res) => {
    // Get hostel id
    //fetch data from req.body
    // vailidation on product and price
    // create entry in db
    // return response

    const user = await User.findById(req.user?._id);
    const {
        itemName,
        itemDescription,
        itemQuantity,
        itemPrice,
        dateOfPurchase,
        itemCategory,
    } = req.body;

    if (!itemName || !itemPrice || !dateOfPurchase) {
        throw new ApiError(404, "Item name, price and date of purchase are Required")
    }

    const newItemName = itemName.toLowerCase();
    const expense = await Expense.create({
        hostel: user.hostel,
        itemName: newItemName,
        itemDescription,
        itemQuantity,
        itemPrice,
        dateOfPurchase,
        itemCategory,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, expense, "Daily Expense Created")
        );

});

const editExpense = asyncHandler(async (req, res) => {
    //find expense id
    //fetch details from req.body
    //findbyid and update expense
    //return response

    const { expenseId } = req.params
    const { itemName, itemDescription, itemQuantity, itemPrice, dateOfPurchase, itemCategory } = req.body;


    let newItemName = null;
    if (itemName) {
        newItemName = itemName.toLowerCase();
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
        expenseId,
        {
            itemName: newItemName,
            itemDescription,
            itemQuantity,
            itemPrice,
            dateOfPurchase,
            itemCategory
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedExpense, "Expense updated successfully")
        );

});

const getExpenseById = asyncHandler(async (req, res) => {

    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);
    // if (!expense) {
    //     throw new ApiError(404,"expense not found")
    // }
    return res
        .status(200)
        .json(
            new ApiResponse(200, expense, "Expense Fetched Successfully")
        );

});

const getExpenseInfo = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);

    const expense = await Expense.find(
        {
            hostel: user.hostel
        }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(200, expense, "Expense Fetched")
        );

});


const deleteExpense = asyncHandler(async (req, res) => {

    const { expenseId } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(
        expenseId,
        {
            new: true
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedExpense, "expense deleted successfully")
        );
});


const getTotalExpense = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);
    const hostelId = user.hostel;

    const totalExpense = await Expense.aggregate([
        {
            $match: { hostel: hostelId }
        },

        {
            $group: {
                _id: null,
                totalPrice: { $sum: "$itemPrice" },
            },
        },
    ]);

    const Items = await Expense.find(
        { hostel: hostelId }
    );
    console.log("total: ", totalExpense);

    let total = totalExpense.length > 0 ? totalExpense[0].totalPrice : 0;

    return res
        .status(200)
        .json(
            new ApiResponse(200, { total, Items }, "Total Expense Fetched Successfully")
        );
});


const getExpenseByItemName = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);
    const hostelId = user.hostel;

    const { itemName } = req.query;

    const totalExpenseByItemName = await Expense.aggregate([
        {
            $match: {
                hostel: hostelId,
                itemName: itemName
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$itemPrice" },
            },
        },
    ]);

    const itemNameWiseExpense = await Expense.find({
        hostel: hostelId,
        itemName: itemName,
    });

    let total = totalExpenseByItemName.length > 0 ? totalExpenseByItemName[0].total : 0;
    return res
        .status(200)
        .json(
            new ApiResponse(200, { total, itemNameWiseExpense }, "Total Expense Fetched Successfully")
        );

});


const getExpenseInDateRange = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);
    const hostelId = user.hostel;

    const { startDate, endDate } = req.query;

    const totalExpense = await Expense.aggregate([
        {
            $match: {
                hostel: hostelId,
                dateOfPurchase:
                {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$itemPrice" },
            },
        },
    ]);

    const expenseInRange = await Expense.find({
        hostel: hostelId,
        dateOfPurchase:
        {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    });

    let total = totalExpense.length > 0 ? totalExpense[0].total : 0;
    return res
        .status(200)
        .json(
            new ApiResponse(200, { total, expenseInRange }, "Total Expense Fetched Successfully")
        );
});

const getExpenseByItemCategory = async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);
    const hostelId = user.hostel;
    const { itemCategory } = req.query;

    const totalExpense = await Expense.aggregate([
        {
            $match: {
                hostel: hostelId,
                itemCategory: itemCategory,
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$itemPrice" },
            },
        },
    ]);

    const categoryWiseExpense = await Expense.find({
        hostel: hostelId,
        itemCategory: itemCategory
    });

    let total = totalExpense.length > 0 ? totalExpense[0].total : 0;
    return res
        .status(200)
        .json(
            new ApiResponse(200, { total, categoryWiseExpense }, "Total Expense Fetched Successfully")
        );
};


const getExpenseInDateRangeByItemCategory = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);
    const hostelId = user.hostel;

    const { startDate, endDate, itemCategory } = req.query;

    const totalExpense = await Expense.aggregate([
        {
            $match: {
                hostel: hostelId,
                itemCategory: itemCategory,
                dateOfPurchase:
                {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$itemPrice" },
            },
        },
    ]);


    const categoryWiseExpense = await Expense.find({
        hostel: hostelId,
        itemCategory: itemCategory,
        dateOfPurchase: {
            $gte: startDate,
            $lte: endDate
        }
    });

    let total = totalExpense.length > 0 ? totalExpense[0].total : 0;

    return res
        .status(200)
        .json(
            new ApiResponse(200, { total, categoryWiseExpense }, "Expense Fetched Successfully")
        );
});



const getExpenseInDateRangeByItemName = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);
    const hostelId = user.hostel;

    const { startDate, endDate, itemName } = req.query;

    const totalExpense = await Expense.aggregate([
        {
            $match: {
                hostel: hostelId,
                itemName: itemName,
                dateOfPurchase:
                {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            },
        },

        {
            $group: {
                _id: null,
                total: { $sum: "$itemPrice" },
            },
        },
    ]);

    const itemNameWiseExpense = await Expense.find({
        hostel: hostelId,
        itemName: itemName,
        dateOfPurchase:
        {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    });

    let total = totalExpense.length > 0 ? totalExpense[0].total : 0;
    return res
        .status(200)
        .json(
            new ApiResponse(200, { total, itemNameWiseExpense }, "Expense Fetched Successfully")
        );

});

export { addExpense, editExpense, getExpenseById, getExpenseInfo, deleteExpense, getTotalExpense, getExpenseByItemName, getExpenseInDateRange, getExpenseByItemCategory, getExpenseInDateRangeByItemCategory, getExpenseInDateRangeByItemName }