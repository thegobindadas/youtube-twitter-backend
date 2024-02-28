import { Router } from "express";
import {     
    publishAVideo,
    getVideoById,
    
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"



const router = Router();


router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file



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


router
    .route("/:videoId")
    .get(getVideoById)





export default router