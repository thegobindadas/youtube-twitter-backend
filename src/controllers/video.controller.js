import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deletePhotoOnCloudinary, deleteVideoOnCloudinary } from "../utils/cloudinary.js"





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


    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnail.url) {
        throw new ApiError(400, "Error while uploading on thumbnail")
    }


    const video = await Video.create({
        title,
        videoFile: videoFile.url,
        duration: videoFile.duration,
        thumbnail: thumbnail.url,
        description,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(500, "Something went wrong while uploading the video")
    }


    return res.status(201).json(
        new ApiResponse(
            200, 
            video, 
            "Video published successfully"
        )
    )

})



const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "video-id is required")
    }


    const video = await Video.findById({
        _id: videoId
    })

    if (!video) {
        throw new ApiError(404, "Video not found")
    }


    return res.status(200).json(
        new ApiResponse(
            200, 
            video, 
            "Video found"
        )
    )
})



const updateVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { title, description } = req.body;
    const  thumbnailLocalPath  = req.file?.path


    if (!videoId) {
        throw new ApiError(400, "video id is required!")
    }


    try {

        const video = await Video.findById({
            _id: videoId
        })
    
        if (!video) {
            throw new ApiError(404, "video does not found")
        }
    

        if (video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized to update this video")
        }

    
        if (title) {
            video.title = title;
        }
    
        if (description) {
            video.description = description;
        }
    
        if (thumbnailLocalPath) {
            const previouThumbnailLink = video.thumbnail
            
            const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
            video.thumbnail = thumbnail.url;


            await deletePhotoOnCloudinary(previouThumbnailLink)
        }
    
        await video.save({ validateBeforeSave: false });
        
    
        return res.status(200).json(
            new ApiResponse(
                200, 
                video, 
                "Video updated successfully"
            )
        )

    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error")
    }

})



const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "video id is required")
    }


    const video = await Video.findById({
        _id: videoId
    });

    if (!video) {
        throw new ApiError(404, "Video does not found")
    }


    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this video")
    }

   
    await video.deleteOne();


    const deleteThumbnailOnCloudinary = await deletePhotoOnCloudinary(video.thumbnail)

    if (!deleteThumbnailOnCloudinary) {
        throw new ApiError(500, "Error while deleting thumbnail from Cloudinary")
    }


    const deleteVideoFromCloudinary = await deleteVideoOnCloudinary(video.videoFile)

    if (!deleteVideoFromCloudinary) {
        throw new ApiError(500, "Error while deleting video from Cloudinary")
    }



    return res.status(200).json(
        new ApiResponse(
            200, 
            {}, 
            "video deleted successfully"
        )
    )
})



const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "video-id is required")
    }


    const video = await Video.findById({
        _id: videoId
    });

    if (!video) {
        throw new ApiError(404, "Video not found")
    }


    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this video")
    }


    video.isPublished = !video.isPublished;

    await video.save({ validateBeforeSave: false });


    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Publish status toggled successfully"
        )
    )
    
})






export {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    
}