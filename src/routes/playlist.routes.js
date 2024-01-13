import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addPlaylist,
  addVideoToPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(addPlaylist);
router.route("/delete/:playlistId").delete(deletePlaylist);
router.route("/update/:playlistId").patch(updatePlaylist);
router.route("/get-playlist/:playlistId").get(getPlaylistById);

router.route("/get-user-playlists/:userId").get(getUserPlaylists);

router.route("/add-playlist/:videoId/:playlistId").patch(addVideoToPlaylist);
router
  .route("/remove-playlist/:videoId/:playlistId")
  .patch(removeVideoFromPlaylist);

export default router;
