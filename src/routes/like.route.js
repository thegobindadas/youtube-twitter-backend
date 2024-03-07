import { Router } from 'express';
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,

} from "../controllers/like.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file



router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);





export default router