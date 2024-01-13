import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params || {};
  const comment = await Comment.findByIdAndDelete(commentId);

  res
    .status(200)
    .json(new ApiResponse("200", comment, "deleted comment successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse("200", {}, "added comment successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "update comment successfully"));
});

const getVideoComments = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "fetched comments of video"));
});

export { deleteComment, addComment, updateComment, getVideoComments };
