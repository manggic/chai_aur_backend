import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/add/:videoId").post(addComment);

router.route("/delete/:commentId").delete(deleteComment);
router.route("/update/:commentId").patch(updateComment);

router.route("/get-comments/:videoId").get(getVideoComments);


export default router