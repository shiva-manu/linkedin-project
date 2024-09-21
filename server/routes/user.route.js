import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getSuggestedConnections } from '../controllers/user.controller.js';
import { getPublicProfile } from '../controllers/user.controller.js';
import { updateProfile } from '../controllers/user.controller.js';
const router=express.Router();

router.get("/suggestion",protectRoute,getSuggestedConnections);
router.get("/:username",protectRoute,getPublicProfile);
router.put("/profile",protectRoute,updateProfile);
export default router;