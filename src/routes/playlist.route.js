import { Router } from 'express';
import {
    createPlaylist,
    getPlaylistById,
    addVideoToPlaylist,

} from "../controllers/playlist.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file


router.route("/").post(createPlaylist)

router
    .route("/:playlistId")
    .get(getPlaylistById)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);





export default router