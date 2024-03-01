import { Router } from "express";
import {
    createTweet,
    getUserTweets,
    
} from "../controllers/tweet.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router();

router.use(verifyJwt); 



router.route("/").post(createTweet);

router.route("/user/:userId").get(getUserTweets);




export default router