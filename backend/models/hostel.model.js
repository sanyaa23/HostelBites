import mongoose, { Schema } from "mongoose";


const hostelSchema = new Schema({

    hostelName: {
        type: String,
        trim: true
    },
    menu: {
        type: Schema.Types.ObjectId,
        ref: "Menu",
    },
    messCommittee: {
        type: Schema.Types.ObjectId,
        ref: "MessCommittee",
    },
    wardenName: {
        type: String,
        trim: true
    },
    accountantName: {
        type: String,
        trim: true
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
},
    {
        timestamps: true
    },
    {
        strictPopulate: false
    }
);


export const Hostel = mongoose.model("Hostel", hostelSchema);