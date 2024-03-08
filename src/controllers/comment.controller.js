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



const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content, videoId } = req.body;
    const ownerId = req.user._id;

    
    const comment = Comment.create({
        content,
        video: videoId,
        owner: ownerId
    });

    if (!comment) {
        throw new ApiError(500, "Something went wrong while saving the comment")
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comment added successfully"
        )
    )
})



const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body;


    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

        
    if (content) {
        comment.content = content;
    }


    const updatedComment = await comment.save({ validateBeforeSave: false });

    if (!updatedComment) {
        throw new ApiError(500, "Something went wrong while updating the comment")
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    )
})



const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }


    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this comment")
    }

    await comment.remove();


    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    )
})





export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}