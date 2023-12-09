import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.js";

const router = Router();

router
  .route("/register")
  .post(
    upload.fields([{ name: "avatar" }, { name: "coverImage" }]),
    registerUser
  );

router.route("/").get((req, res, next) => {
  res.status(200).json({
    message: "User home route",
  });
});

export default router;
