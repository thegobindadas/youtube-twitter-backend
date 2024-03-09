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


    const video = await Video.findById(videoId)


    if (playlist.owner.toString() !== req.user._id.toString() || video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to add video to playlist")
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



const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    const { playlistId, videoId } = req.params
    

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video does not exist in the playlist");
    }


    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to remove video from playlist")
    }


    playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);
    await playlist.save({ validateBeforeSave: false });


    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Remove video from playlist"
        )
    )
})



const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    const { playlistId } = req.params


    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "unauthorized to delete the playlist")
    }


    await playlist.deleteOne();


    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Delete playlist"
        )
    )
    
})



const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    const { playlistId } = req.params
    const { name, description } = req.body
    

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }


    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "unauthorized to update the playlist")
    }


    if (name) {
        playlist.name = name;
    }

    if (description) {
        playlist.description = description;
    }


    await playlist.save({ validateBeforeSave: false });
    

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Update playlist"
        )
    )
})



const getUserPlaylists = asyncHandler(async (req, res) => {
    // get user playlists
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, "user-id is required")
    }
    

    const userPlaylists = await Playlist.find({ owner: userId });

    if (!userPlaylists) {
        throw new ApiError(404, "No playlist found from this user")
    }
    

    return res.status(200).json(
        new ApiResponse(
            200,
            userPlaylists,
            "Get user playlists"
        )
    )
})





export {
    createPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    getUserPlaylists
}