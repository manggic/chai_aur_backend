import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const test = (req, res) => {
  res.status(200).json({ success: true, msg: "api for testing" });
};

const getUserVideos = asyncHandler((req, res) => {});

const getVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params || {};

  const video = await Video.findById(videoId);

  res
    .status(200)
    .json(new ApiResponse("200", video, "fetched user data successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  // TODO
  // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

  const videos = await Video.find({});

  res
    .status(200)
    .json(new ApiResponse("200", videos, "get video successfully"));
});

const updateVideo = asyncHandler((req, res) => {});

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { thumbnail, videoFile } = req.files;

  const thumnailLocalPath = thumbnail[0].path;
  const videoFileLocalPath = videoFile[0].path;

  const thumbnailCloud = await uploadOnCloudinary(thumnailLocalPath);
  const videoFileCloud = await uploadOnCloudinary(videoFileLocalPath);

  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnailCloud?.url,
    videoFile: videoFileCloud?.url,
    duration: parseInt(videoFileCloud?.duration),
    owner: req.user._id,
  });

  res.status(200).json(new ApiResponse(200, video, "testing video upload"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params || {};

  console.log({ videoId });

  if (!videoId) {
    throw new ApiError(401, "Pls provide videoId");
  }

  const video = await Video.findByIdAndDelete(videoId, { $set: {} });

  res
    .status(200)
    .json(new ApiResponse("200", video, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export { test, deleteVideo, uploadVideo, getAllVideos, getVideo };
