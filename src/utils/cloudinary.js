import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});




const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);


        fs.unlinkSync(localFilePath)

        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}



const deletePhotoOnCloudinary = async (cloudinaryFilePathUrl) => {
    
    try {
        
        if (!cloudinaryFilePathUrl) return null


        const parts = cloudinaryFilePathUrl.split('/');
        const fileName = parts[parts.length - 1].split('.')[0];
        //console.log(fileName);


        const result = await cloudinary.uploader.destroy(fileName.toString(), {
            resource_type: "image",
            //type: 'authenticated'
        });

        //console.log(result)


        return result;

    } catch (error) {
        return null
    }
};





export { 
    uploadOnCloudinary,
    deletePhotoOnCloudinary,
    
}