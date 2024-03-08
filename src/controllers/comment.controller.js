import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";




const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query


    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: 'owner',
        sort: { createdAt: -1 }
    };

    const comments = await Comment.paginate({ video: videoId }, options);


    return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "Get all comments for a video"
        )
    )

})





export {
    getVideoComments,
    
}