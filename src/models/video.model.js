// Import necessary modules from Mongoose for defining schemas and models
import mongoose, { Schema } from "mongoose";

// Import Mongoose plugin for pagination
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define a Mongoose schema for the 'Video' model
const videoSchema = new Schema(
    {
        // Cloudinary URL for the video file
        videoFile: {
            type: String,
            required: true
        },
        // Cloudinary URL for the video thumbnail
        thumbnail: {
            type: String,
            required: true
        },
        // Title of the video
        title: {
            type: String,
            required: true
        },
        // Description of the video
        description: {
            type: String,
            required: true
        },
        // Duration of the video in seconds
        duration: {
            type: Number,
            required: true
        },
        // Number of views the video has
        views: {
            type: Number,
            default: 0
        },
        // Flag indicating whether the video is published or not
        isPublished: {
            type: Boolean,
            default: true
        },
        // Reference to the owner (User) of the video
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        // Enable timestamps to automatically track 'createdAt' and 'updatedAt'
        timestamps: true
    }
);

// Apply the Mongoose plugin for pagination to the 'videoSchema'
videoSchema.plugin(mongooseAggregatePaginate);

// Create and export the Mongoose model 'Video' based on the 'videoSchema'
export const Video = mongoose.model("Video", videoSchema);
