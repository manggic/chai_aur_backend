// Importing necessary modules and utilities
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const { REFRESH_TOKEN_SECRET } = process.env;

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(
      "++++++++++++++++ generateAccessAndRefreshToken ERROR +++++++++++++++++++",
      error
    );
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  // Extracting data from the request body
  const { email, username, password } = req.body;

  // Checking if either username or email is provided
  if (!(username || email)) {
    throw new ApiError(400, "Required username or email");
  }

  // Finding a user based on username or email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // If no user is found, throw an error
  if (!user) {
    throw new ApiError(201, "User not found");
  }

  // Checking if the provided password is correct
  const isPassValid = await user.isPasswordCorrect(password);

  // If the password is not valid, throw an error
  if (!isPassValid) {
    throw new ApiError(201, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Configuring options for cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  const userObject = user.toObject({ getters: true, virtuals: false });

  // Setting cookies and sending a JSON response
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { ...userObject, accessToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  // Finding the user by ID and updating the accessToken to undefined
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        accessToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // Configuring options for cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Clearing the accessToken and refreshToken cookies
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    // Sending a JSON response with a ApiResponse indicating successful logout
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {

    // fetch refresh token from cookies
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;


    // throw error if cookies is not present  
    if (!incomingRefreshToken) {
      throw new ApiError("Invalid refresh token");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);


    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "User not found in DB");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError("sent refresh token does not match with DB refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Refresh token sucessfully done"
        )
      );
  } catch (error) {
    console.log("refreshAccessToken ERROR", error);
    throw new ApiError(401, 'Invalid access token')
  }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req?.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(200, "Invalid old password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed sucessfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullname || !email) {
    throw new ApiError(401, "pls provide correct data");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");

  await user.save();

  res.status(200).json(new ApiResponse(200, user, "updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(404, "Error while uploading avatar file on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar?.url,
      },
    },
    { new: true }
  ).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, user, "avatar updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(401, "Invalid username");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        email: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  console.log("============== channel ==================", channel);

  if (!channel?.length) {
    throw new ApiError(401, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, channel[0], "User profile fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  // Using the 'await' keyword to ensure that the aggregation operation is complete before proceeding
  const user = await User.aggregate([
    // Stage 1: Match documents based on the provided condition
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req?.user?._id), // Match the '_id' field with the specified user's ID
      },
    },
    // Stage 2: Perform a lookup to retrieve data from the 'videos' collection
    {
      $lookup: {
        from: "videos", // Source collection for the lookup operation
        localField: "watchHistory", // Field from the current collection
        foreignField: "_id", // Field from the 'videos' collection
        as: "watchHistory", // Alias for the output field containing the results of the lookup
        pipeline: [
          // Sub-pipeline for the 'videos' collection lookup
          {
            // Nested lookup to retrieve information about the video owner from the 'users' collection
            $lookup: {
              from: "users", // Source collection for the nested lookup
              localField: "owner", // Field from the current 'videos' collection
              foreignField: "_id", // Field from the 'users' collection
              as: "owner", // Alias for the output field containing the results of the nested lookup
              pipeline: [
                // Sub-pipeline for projecting specific fields from the 'users' collection
                {
                  $project: {
                    fullName: 1, // Include the 'fullName' field
                    username: 1, // Include the 'username' field
                    avatar: 1, // Include the 'avatar' field
                  },
                },
              ],
            },
          },
          // AddFields stage to rename the 'owner' array to a single object using $first
          {
            $addFields: {
              owner: {
                $first: "$owner", // Take the first (and only) element of the 'owner' array
              },
            },
          },
        ],
      },
    },
  ]);

  // The 'user' variable now contains the result of the aggregation operation with the specified lookup and matching conditions.

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watch history fetch successfully"
      )
    );
});

// Export the user registration function
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory,
};
