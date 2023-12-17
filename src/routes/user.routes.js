import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(
    upload.fields([{ name: "avatar" }, { name: "coverImage" }]),
    registerUser
  );

router.route("/login").post(loginUser);

router.route("/logout").get(verifyJWT,logoutUser);
router.route("/").get((req, res, next) => {
  res.status(200).json({
    message: "User home route",
  });
});

router.route("/refresh-token").post(refreshAccessToken);
export default router;
