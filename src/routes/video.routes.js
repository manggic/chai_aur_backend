import { Router } from "express";
import { deleteVideo, getAllVideos, test, uploadVideo, getVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/test").get(test);
router.route("/delete/:videoId").delete(deleteVideo);
router.route("/get-all-videos").get(getAllVideos);
router.route("/get-video/:videoId").get(getVideo);


router.route("/upload").post(upload.fields([{ name: "thumbnail" }, { name: "videoFile" }]),uploadVideo);

export default router;
