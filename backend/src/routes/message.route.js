import express from "express";
import { getChat, getUsersForSidebar,sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router=express.Router();

router.get('/users',protectRoute,getUsersForSidebar);
router.get('/:id',protectRoute,getChat);
router.post('/send/:id',protectRoute,sendMessage);

export default router;
