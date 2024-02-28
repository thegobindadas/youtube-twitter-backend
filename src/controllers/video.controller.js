import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"





const publishAVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body
    const videoFileLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;


    if (!(title && description)) {
        throw new ApiError(400, "All field are required")
    }

    if (!videoFileLocalPath) {
        throw new ApiError(400, "video file path is missing")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail file path is missing")
    }


    const videoFile = await uploadOnCloudinary(videoFileLocalPath)

    if (!videoFile.url) {
        throw new ApiError(400, "Error while uploading on video")
    }


    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnailFile.url) {
        throw new ApiError(400, "Error while uploading on thumbnail")
    }


    const video = await Video.create({
        title,
        videoFile: videoFile.url,
        duration: videoFile.duration,
        thumbnail: thumbnailFile.url,
        description,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(500, "Something went wrong while uploading the video")
    }


    return res.status(200).json(
        new ApiResponse(
            200, 
            video, 
            "Video published successfully"
        )
    )

})








export {
    publishAVideo,

}