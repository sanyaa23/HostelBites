import mongoose, { Schema } from 'mongoose';

const ratingSchema = new Schema({

    ratedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'Hostel'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },
    mealType: {
        type: String,
        enum: ["breakFast", "lunch", "snacks", "dinner"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: "30d" // The document will be automatically deleted after 30 days of its creation time
    },
});


export const Rating = mongoose.model("Rating", ratingSchema);