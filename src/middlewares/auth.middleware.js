import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_SECRET } = process.env;


// Middleware function to verify the validity of an access token
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Extracting the access token from either cookies or the Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If no token is present, throw an unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized user");
    }

    // Verifying the access token using the secret key (ACCESS_TOKEN_SECRET)
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // Finding the user based on the decoded token's ID and excluding sensitive information
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    // If no user is found, the access token is considered invalid
    if (!user) {
      throw new ApiError(400, "Access token is invalid");
    }

    // Setting the user object in the request for further middleware or route handling
    req.user = user;
  } catch (error) {
    // Logging any errors during token verification
    console.log("verifyJWT ERROR", error);
    // Throwing an API error with a 400 status and the error message
    throw new ApiError(400, error?.message);
  } finally {
    // Moving to the next middleware or route handling, regardless of success or failure
    next();
  }
});

