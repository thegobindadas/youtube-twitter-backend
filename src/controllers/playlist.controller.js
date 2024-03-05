import mongoose, {isValidObjectId} from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";



const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }


    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    if (!playlist) {
        throw new ApiError(500, "Error while creating the playlist")
    }


    return res.status(201).json(
        new ApiResponse(
            200,
            playlist,
            "playlist is created"
        )
    )
    
})



const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    const { playlistId } = req.params


    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Get playlist by id"
        )
    )
})



const addVideoToPlaylist = asyncHandler(async (req, res) => {
    // Add Video To Playlist
    const { playlistId, videoId } = req.params


    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist");
    }


    playlist.videos.push(videoId);
    await playlist.save({ validateBeforeSave: false });


    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Add Video To Playlist"
        )
    )
})




export {
    createPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    
}