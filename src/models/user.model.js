// Import necessary modules from Mongoose for defining schemas and models
import mongoose, { Schema } from "mongoose";

// Import modules for JSON Web Token (JWT) and bcrypt for password hashing
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define a Mongoose schema for the 'User' model
const userSchema = new Schema(
    {
        // User's username
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        // User's email
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        // User's full name
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        // URL for the user's avatar (stored on Cloudinary)
        avatar: {
            type: String,
            required: true,
        },
        // URL for the user's cover image (stored on Cloudinary)
        coverImage: {
            type: String,
        },
        // Array of video IDs representing the user's watch history
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        // User's password (hashed)
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        // Refresh token for JWT authentication
        refreshToken: {
            type: String,
        },
    },
    {
        // Enable timestamps to automatically track 'createdAt' and 'updatedAt'
        timestamps: true,
    }
);

// Middleware function executed before saving a user document
userSchema.pre("save", async function (next) {
    // Hash the password if it has been modified
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check if the entered password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate an access token for the user
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Method to generate a refresh token for the user
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

// Create and export the Mongoose model 'User' based on the 'userSchema'
export const User = mongoose.model("User", userSchema);
