// Importing necessary modules and utilities
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Define a function to handle user registration
const registerUser = asyncHandler(async function (req, res, next) {
  // Extracting user registration data from the request body
  const { username, email, password, fullName } = req.body || {};

  // Check if any required field is missing or empty
  if (
    [username, email, password, fullName].some(function (field) {
      return !field;
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if a user with the same username or email already exists
  const existedUser = await User.findOne({
    $or: [{ username: username, email: email }],
  });

  if (existedUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  // Log the files attached to the request (for debugging purposes)
  console.log("++++++++++++++ req.files ++++++++++++++", req.files);

  // Extract local paths of avatar and cover image files from the request
  const avatarLocalPath = req.files?.["avatar"]?.[0]?.path;
  const coverImageLocalPath = req.files?.["coverImage"]?.[0]?.path;

  // Check if avatar file is provided
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Upload avatar and cover image files to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // Check if avatar upload was successful
  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed on cloudinary");
  }

  // Create a new user in the database with the provided data
  const user = await User.create({
    username,
    email,
    password,
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
  });

  const userResponse = user;
  userResponse.password = undefined;
  userResponse.refreshToken = undefined;

  // Check if user creation was successful
  if (!user) {
    throw new ApiError(500, "User creation failed");
  }

  // Respond with a success message and the created user data (excluding sensitive information)
  res
    .status(200)
    .json(new ApiResponse(200, userResponse, "User created successfully"));
});

// Export the user registration function
export { registerUser };
