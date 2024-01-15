import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, toggleSubscription, getUserChannelSubscribers, getAllSub } from "../controllers/subscription.controller.js";



const router = Router();

router.use(verifyJWT)

router.route("/c/:channelId")
.get(getUserChannelSubscribers)
.post(toggleSubscription);


// find subscriber of subscriberId => subscriberId === channelId => count
router.route("/u/:subscriberId").get(getSubscribedChannels);


router.route('/').get(getAllSub)

export default router;





