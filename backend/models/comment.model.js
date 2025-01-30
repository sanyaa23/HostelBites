import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    complaintId: {
        type: Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true
    },
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

},
    {
        timestamps: true
    }

);

export const Comment = mongoose.model("Comment", commentSchema)
