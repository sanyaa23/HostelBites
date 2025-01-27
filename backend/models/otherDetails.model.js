import mongoose, { Schema } from "mongoose";

const otherDetailsSchema = new Schema({
    gender: {
        type: String,
    },
    DOB: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    AccountNo: {
        type: String,
        trim: true,
    },
    IFSC: {
        type: String,
        trim: true,
    },
    isMessFeePaid: {
        type: Boolean,
        trim: true,
        default: false
    },
    roomNo: {
        type: Number,
        trim: true,
    },
    phoneNo: {
        type: Number,
        trim: true,
    },
    branch: {
        type: String,
        trim: true,
    }
},
    {
        timestamps: true
    },
    {
        strictPopulate: false
    });



export const OtherDetails = mongoose.model("OtherDetails", otherDetailsSchema);