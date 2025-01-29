import mongoose, { Schema } from "mongoose";

const complaintSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hostelName: {
        type: String,
        required: true
    },
    complaintBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
    },
    upVotedBy: [
        {
            type: String
        }
    ],
    downVotedBy: [
        {
            type: String
        }
    ],
    isResolved: {
        type: Boolean,
        required: true,
        default: false
    },
    resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
},
    {
        timestamps: true
    },
    {
        strictPopulate: false
    });


export const Complaint = mongoose.model("Complaint", complaintSchema);