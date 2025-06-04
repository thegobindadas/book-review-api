import mongoose, { Schema } from "mongoose";


const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    author: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    genre: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    description: {
        type: String
    },
    publishedDate: {
        type: Date
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})



export const Book = mongoose.model("Book", bookSchema)