// Import the Cloudinary library (v2 version) and the 'fs' module for file system operations
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Destructure Cloudinary credentials from environment variables
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

// Configure Cloudinary with the provided credentials
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Define a function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check if the local file path is provided
    if (!localFilePath) return null;

    // Upload the file to Cloudinary with auto-detection of resource type
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been successfully uploaded to Cloudinary
    console.log("++++++++++++++ Response of file uploaded on Cloudinary ++++++++++++++", response);

    // Return the Cloudinary response
    return response;
  } catch (error) {
    // An error occurred during the upload process

    // Remove the locally saved temporary file as the upload operation failed
    fs.unlinkSync(localFilePath);

    console.log("++++++++++++++ uploadOnCloudinary ++++++++++++++", error);

    // Return null to indicate the failure of the upload operation
    return null;
  }
};

// Export the 'uploadOnCloudinary' function for use in other modules
export { uploadOnCloudinary };
