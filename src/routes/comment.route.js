import { Router } from "express";
import { 
    getVideoComments,
    addComment,
    updateComment,

} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file




router
    .route("/:videoId")
    .get(getVideoComments)
    .post(addComment);

router
    .route("/c/:commentId")
    .patch(updateComment);




export default router