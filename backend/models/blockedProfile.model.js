import mongoose, { Schema } from 'mongoose';

const blockedProfileSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    });


export const BlockedProfile = mongoose.model("BlockedProfile", blockedProfileSchema);