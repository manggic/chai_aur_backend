import asyncHandler from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const addPlaylist = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "created playlist successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "deleted playlist successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "updated playlist successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "fetched user playlist successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "added video to playlist successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "Removed video from playlist successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("200", {}, "fetched playlist successfully"));
});

export {
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistById,
  removeVideoFromPlaylist,
  addVideoToPlaylist,
  getUserPlaylists,
};
