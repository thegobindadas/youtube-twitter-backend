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





export {
    createTweet,
    
}