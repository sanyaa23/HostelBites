import mongoose, { Schema } from "mongoose";
import { meals } from "../constants.js";



const menuSchema = new Schema({
    hostel: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    monday: meals,
    tuesday: meals,
    wednesday: meals,
    thursday: meals,
    friday: meals,
    saturday: meals,
    sunday: meals,
    signedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }


},
    {
        timestamps: true
    },
    {
        strictPopulate: false
    });


export const Menu = mongoose.model("Menu", menuSchema);