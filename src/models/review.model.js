import mongoose, { Schema } from "mongoose";


const reviewSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: { 
        type: String, 
        trim: true 
    },
}, {
    timestamps: true
})


// Ensure one review per user per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });



export const Review = mongoose.model("Review", reviewSchema);