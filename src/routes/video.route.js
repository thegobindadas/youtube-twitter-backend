import { Router } from "express";
import {     
    publishAVideo,

} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"



const router = Router();


router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file



router
    .route("/")
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );







export default router