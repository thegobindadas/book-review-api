import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Book } from "../models/book.model.js";
import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



export const createNewBook = asyncHandler(async (req, res) => {

    const { title, author, genre, description, publishedDate } = req.body

    if (!title || !author || !genre) {
        throw new ApiError(400, "Missing required fields. Title, author, and genre must be provided.")
    }
    

    const newBook = await Book.create({ 
        title, 
        author, 
        genre, 
        description, 
        publishedDate, 
        createdBy: req.user._id 
    })

    if (!newBook) {
        throw new ApiError(500, "Failed to create the book. Please try again later.")
    }



    return res
        .status(201)
        .json(
            new ApiResponse(
                200, 
                newBook, 
                "Book created successfully."
            )
        )
})


export const getAllBooks = asyncHandler(async (req, res) => {
    
    const { page = 1, limit = 10, author, genre } = req.query;

    const skip = (page - 1) * limit;

    const filter = {};


    if (author) {
        filter.author = { $regex: author, $options: "i" }; // case-insensitive
    }

    if (genre) {
        filter.genre = { $regex: genre, $options: "i" };
    }

    
    const [books, totalBooks] = await Promise.all([
        Book.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
        Book.countDocuments(filter),
    ]);

    if (!books) {
        throw new ApiError(500, "Failed to fetch books. Please try again later.")
    }

    const totalPages = Math.ceil(totalBooks / limit);



    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    books,
                    totalBooks,
                    currentPage: parseInt(page),
                    totalPages,
                },
                "Books fetched successfully."
            )
        )
})


export const getBookDetails = asyncHandler(async (req, res) => {

    const bookId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
 
    if (!isValidObjectId(bookId)) {
        throw new ApiError(400, "Invalid book ID.")
    }


    const bookWithReviews = await Book.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(bookId) }
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "book",
                as: "reviews"
            }
        },
        {
            $addFields: {
                averageRating: { $avg: "$reviews.rating" },
                totalReviews: { $size: "$reviews" }
            }
        },
        {
            $project: {
                reviews: {
                    $slice: ["$reviews", skip, limit]
                },
                title: 1,
                author: 1,
                genre: 1,
                description: 1,
                publishedDate: 1,
                createdBy: 1,
                createdAt: 1,
                updatedAt: 1,
                averageRating: { $round: ["$averageRating", 1] },
                totalReviews: 1
            }
        },
        { $unwind: "$reviews" },
        {
            $lookup: {
                from: "users",
                localField: "reviews.user",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $group: {
                _id: "$_id",
                title: { $first: "$title" },
                author: { $first: "$author" },
                genre: { $first: "$genre" },
                description: { $first: "$description" },
                publishedDate: { $first: "$publishedDate" },
                createdBy: { $first: "$createdBy" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                averageRating: { $first: "$averageRating" },
                totalReviews: { $first: "$totalReviews" },
                reviews: {
                    $push: {
                        _id: "$reviews._id",
                        userId: "$userDetails._id",
                        username: "$userDetails.username",
                        email: "$userDetails.email",
                        rating: "$reviews.rating",
                        comment: "$reviews.comment",
                        createdAt: "$reviews.createdAt",
                        updatedAt: "$reviews.updatedAt"
                    }
                }
            }
        }
    ]);

    if (!bookWithReviews[0]) {
        throw new ApiError(404, "Book not found.")
    }

    const totalPages = Math.ceil((bookWithReviews[0]?.totalReviews || 0) / limit);



    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    ...bookWithReviews[0],
                    currentPage: page,
                    totalPages
                },
                "Book details fetched successfully."
            )
        )
})


export const addReviewToBook = asyncHandler(async (req, res) => {

    const bookId = req.params.id;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    if (!isValidObjectId(bookId)) {
        throw new ApiError(400, "Invalid book ID.")
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5.");
    }


    // Check if the book exists
    const book = await Book.findById(bookId);

    if (!book) {
        throw new ApiError(404, "Book not found.");
    }


    // Check if the user has already reviewed the book
    const existingReview = await Review.findOne({ book: bookId, user: userId });

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this book.");
    }


    const newReview = await Review.create({
        book: bookId,
        user: userId,
        rating,
        comment,
    });

    if (!newReview) {
        throw new ApiError(500, "Failed to add review. Please try again later.")
    }



    return res
        .status(201)
        .json(
            new ApiResponse(
                200, 
                newReview, 
                "Review added successfully."
            )
        )
})