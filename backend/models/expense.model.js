import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    itemName: {
        type: String,
        trim: true,
        required: true
    },
    itemtDescription: {
        type: String,
        trim: true
    },
    itemQuantity: {
        type: String,
        trim: true
    },
    itemPrice: {
        type: Number,
        required: true
    },
    dateOfPurchase: {
        type: Date,
        required: true
    },
    itemCategory: {
        type: String,
        enum: ["Vegetables", "Oils", "Groceries", "Cleaning-items", "Dairy", "Furniture-and-Utensils", "Others"],
    }
},
    {
        timestamps: true
    });



export const Expense = mongoose.model("Expense", expenseSchema);