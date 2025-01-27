import mongoose, { Schema } from "mongoose";

const messCommitteeSchema = new Schema({
    hostel: {
        type: Schema.Types.ObjectId,
        required: true
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
},
    {
        timestamps: true
    });

export const MessCommittee = mongoose.model("MessCommittee", messCommitteeSchema);