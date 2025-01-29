import mongoose, { Schema } from "mongoose";

const CommitteeSchema = new Schema({
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

export const Committee = mongoose.model("Committee", CommitteeSchema);