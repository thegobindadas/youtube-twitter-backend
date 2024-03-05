import { Router } from 'express';
import {
    createPlaylist,

} from "../controllers/playlist.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file


router.route("/").post(createPlaylist)





export default router