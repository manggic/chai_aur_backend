import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // const channelSubTo = await Subscription.find({ subscriber: subscriberId });

  const channelSubTo = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelInfo",
      },
    },
    {
      $unwind: "$channelInfo",
    },
    {
      $project: {
        channelInfo: 1,
      },
    },
  ]);
  res
    .status(200)
    .json(
      new ApiResponse(
        "200",
        channelSubTo,
        "fetched subscribed channel successfully"
      )
    );
});

const toggleSubscription = asyncHandler(async (req, res) => {
  // Extract channelId from request parameters
  const { channelId } = req.params || {};

  // Check if channelId is provided
  if (!channelId) {
    throw new ApiError(400, "Please provide channelId");
  }

  // Validate req.user._id
  if (!req.user._id) {
    throw new ApiError(400, "Invalid user ID");
  }

  try {
    // Check if the target channel exists
    const channel = await User.findById(channelId);

    if (!channel) {
      throw new ApiError(400, "Invalid channel ID");
    }

    // Check if a subscription already exists
    const ifSubAlreadyPresent = await Subscription.findOne({
      $and: [{ channel: channelId }, { subscriber: req.user._id }],
    });

    let sub;

    // Toggle subscription based on its existence
    if (!ifSubAlreadyPresent) {
      // If not present, create a new subscription
      sub = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId,
      });
    } else {
      // If already present, delete the subscription
      sub = await Subscription.findByIdAndDelete(ifSubAlreadyPresent?._id);
    }

    // Return a success response with the updated subscription status
    res
      .status(200)
      .json(new ApiResponse("200", sub, "Toggled subscription successfully"));
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Return a generic error response
    throw new ApiError(500, "Internal Server Error");
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subOfChannel = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberInfo",
      },
    },
    {
      $unwind: "$subscriberInfo",
    },
    {
      $project: {
        subscriberInfo: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        "200",
        subOfChannel,
        "fetched user channel sub successfully"
      )
    );
});

const getAllSub = asyncHandler(async (req, res) => {
  const allUser = await Subscription.find({});

  res
    .status(200)
    .json(
      new ApiResponse("200", allUser, "fetched user channel sub successfully")
    );
});

export {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
  getAllSub,
};
