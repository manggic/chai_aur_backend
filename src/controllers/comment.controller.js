import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import mongoose from "mongoose";

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params || {};
  const comment = await Comment.findByIdAndDelete(commentId);

  res
    .status(200)
    .json(new ApiResponse("200", comment, "deleted comment successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params || {};

  const { content } = req.body;

  const comment = await Comment.create({
    content,
    owner: req.user._id,
    video: videoId,
  });
  return res
    .status(200)
    .json(new ApiResponse("200", comment, "added comment successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const { content } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    {
      _id: commentId,
    },
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse("200", comment, "update comment successfully"));
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.find({ video: videoId });

  res
    .status(200)
    .json(new ApiResponse("200", comments, "fetched comments of video"));
});

export { deleteComment, addComment, updateComment, getVideoComments };
