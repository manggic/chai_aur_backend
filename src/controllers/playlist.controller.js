import asyncHandler from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";

const addPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const playlist = await Playlist.create({
    name,
    description,
    videos: [],
    owner: req?.user?._id,
  });

  res
    .status(200)
    .json(new ApiResponse("200", playlist, "created playlist successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const data = await Playlist.findByIdAndDelete(playlistId);

  res
    .status(200)
    .json(new ApiResponse("200", data, "deleted playlist successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const { name, description } = req.body;

  const data = await Playlist.findByIdAndUpdate(
    { _id: playlistId },
    {
      $set: { name, description },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse("200", data, "updated playlist successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {

  const { userId } = req.params 

  const data = await Playlist.find({owner:userId})

  res
    .status(200)
    .json(new ApiResponse("200", data, "fetched user playlist successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  const data = await Playlist.findByIdAndUpdate(
    { _id: playlistId },
    {
      $push: { videos: videoId },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse("200", data, "added video to playlist successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  const data = await Playlist.findByIdAndUpdate(
    { _id: playlistId },
    {
      $pull: { videos: videoId },
    },
    {
      new: true,
    }
  );
  res
    .status(200)
    .json(
      new ApiResponse("200", data, "Removed video from playlist successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const data = await Playlist.findById(playlistId);

  res
    .status(200)
    .json(new ApiResponse("200", data, "fetched playlist successfully"));
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
