import express from "express";
import { login,signup,logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router=express.Router();

router.post('/login',login);
router.post('/signup',signup);
router.post('/logout',logout);
router.put('/update-user',protectRoute,updateProfile);

export default router;