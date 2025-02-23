import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, addMember, removeMember, sendMessage, getGroupMessages, getUserGroups } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup); // Create a new group
router.post("/add-member", protectRoute, addMember); // Add a user to a group
router.post("/remove-member", protectRoute, removeMember); // Remove a user from a group
router.post("/send/:groupId", protectRoute, sendMessage); // Send a message in a group
router.get("/messages/:groupId", protectRoute, getGroupMessages); // Get messages of a group
router.get("/user", protectRoute, getUserGroups); // Get all groups of a user

export default router;
