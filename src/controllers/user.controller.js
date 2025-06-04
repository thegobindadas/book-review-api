import mongoose, { isValidObjectId } from "mongoose";
import config from "../config/index.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token.") 
    }
};



export const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    if (!username) {
        throw new ApiError(400, "Username is required.")
    }

    if (!email) {
        throw new ApiError(400, "Email is required.")
    }

    if (!password) {
        throw new ApiError(400, "Password is required.")
    }


    const existingUser = await User.findOne({ 
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists.")
    }


    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
    })

    if (!user) {
        throw new ApiError(500, "User registration failed. Please try again later.")
    }


    const newUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
    }



    return res
        .status(201)
        .json(
            new ApiResponse(
                200, 
                newUser, 
                "User registered successfully."
            )
        )
});


export const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required.")
    }

    // if (!(username || email)) {
    //     throw new ApiError(400, "Username or email is required") 
    //}

    if (!password) {
        throw new ApiError(400, "Password is required.")
    }


    const user = await User.findOne({ 
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exists. Please register first.")
    }


    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid login credentials. Please check your username and password.")
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if (!loggedInUser) {
        throw new ApiError(500, "Login failed. Please try again later.")
    }



    const options = {
        httpOnly: true,
        secure: true
    }


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }, 
                "User logged in successfully."
            )
        )
});


export const logoutUser = asyncHandler(async (req, res) => {   

    const logoutUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    if (!logoutUser) {
        throw new ApiError(500, "Logout failed. Please try again later.")
    }



    const options = {
        httpOnly: true,
        secure: true
    }

    
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "User logged out successfully."
            )
        )
});