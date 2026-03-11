import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist, emptyWishlist } from "../controllers/wishlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(protectRoute); 

router.post("/:productId", addToWishlist);
router.get("/", getWishlist);
router.delete("/", emptyWishlist)
router.delete("/:productId", removeFromWishlist);

export default router;
 