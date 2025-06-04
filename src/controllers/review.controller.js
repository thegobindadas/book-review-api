import mongoose, { isValidObjectId } from "mongoose";
import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



export const updateReview = asyncHandler(async (req, res) => {

    const reviewId = req.params.id;
    const userId = req.user._id;
    const { rating, comment } = req.body || {};


    if (!isValidObjectId(reviewId)) {
        throw new ApiError(400, "Invalid review ID.")
    }


    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found.")
    }


    if (!review.user.equals(userId)) {
        throw new ApiError(403, "Unauthorized to update this review.")
    }


    if (rating !== undefined) {
        if (rating < 1 || rating > 5) {
            throw new ApiError(400, "Rating must be between 1 and 5.")
        }

        review.rating = rating;
    }

    if (typeof comment === "string") {
        review.comment = comment.trim();
    }


    await review.save();



    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                review, 
                "Review updated successfully."
            )
        )
    
})


export const deleteReview = asyncHandler(async (req, res) => {

    const reviewId = req.params.id;
    const userId = req.user._id; // Extracted from JWT auth middleware


    if (!isValidObjectId(reviewId)) {
        throw new ApiError(400, "Invalid review ID.")
    }


    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found.")
    }


    if (!review.user.equals(userId)) {
        throw new ApiError(403, "unauthorized to delete this review.")
    }


    const deletedReview = await review.deleteOne();

    if (!deletedReview) {
        throw new ApiError(500, "Failed to delete the review. Please try again later.")
    }



    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "Review deleted successfully."
            )
        )
})