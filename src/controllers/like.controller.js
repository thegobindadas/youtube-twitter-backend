import mongoose, {isValidObjectId} from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";



const toggleVideoLike = asyncHandler(async (req, res) => {
    
    const { videoId } = req.params
    const userId = req.user._id;


    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });


    if (existingLike) {

        await existingLike.remove();

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Unliked the video"
            )
        )

    } else {

        const newLike = await Like.create({
            video: videoId,
            likedBy: userId
        });
        

        return res.status(200).json(
            new ApiResponse(
                200,
                newLike,
                "Liked the video"
            )
        )
    }
})





export {
    toggleVideoLike,
    
}