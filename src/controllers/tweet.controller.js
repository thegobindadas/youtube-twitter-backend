import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body;
    const owner = req.user;

    if (!content) {
        throw new ApiError(400, "Tweet content is required")
    }


    const tweet = await Tweet.create({
        content,
        owner
    });

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while create the new tweet")
    }


    return res.status(201).json(
        new ApiResponse(
            200,
            tweet,
            "Tweet created successfully"
        )
    )

})



const getUserTweets = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(401, "User not logged in")
    }


    const userTweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });
    

    if (!userTweets) {
        throw new ApiError(401, "No tweets found for the user")
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            userTweets,
            "Get user tweets"
        )
    )

})





export {
    createTweet,
    getUserTweets,
    
}