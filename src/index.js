import dotenv from "dotenv";
import connectDB from "./DB/index.js";
import { app } from "./app.js";



dotenv.config({
    path: './.env'
})




connectDB()
.then(() => {

    app.on("error", (error) => {
        console.log("Error: ", error);
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is listining on port ${process.env.PORT}`);
    })
    
})
.catch((error) => {
    console.log("MongoDB Connection Failed !! ", error);
})


























/*
// Database connection
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

(async () => {

    try {

        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", (error) => {
            console.log("Error:", error);
            throw error
        })


        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.log("MongoDB connection Failed!!!", error);
        throw error
    }
})()
*/