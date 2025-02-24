import { db } from "../libs/db.js";
import { io } from "../libs/socket.js";
import cloudinary from "../libs/cloudinary.js";

export const createGroup = async (req, res) => {
    try {
        const { name,profilepic,description,selectedIDs } = req.body;
        const created_by = req.user.id;

        let imageUrl = null;
        if (profilepic) {
            const uploadResponse = await cloudinary.uploader.upload(profilepic);
            imageUrl = uploadResponse.secure_url;
        }

        const { rows } = await db.query(
            `INSERT INTO groups (name,description, created_by,profilepic) VALUES ($1, $2, $3,$4) RETURNING *`,
            [name,description, created_by,imageUrl]
        );

        const groupId = rows[0].id;

        await db.query(
            `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`,
            [groupId, created_by]
        );

        if(selectedIDs){
            selectedIDs.map(async(ID)=>{
                await db.query(
                    `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`,
                    [groupId, ID]
                );
            });
        }
        
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error in createGroup: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addMember = async (req, res) => {
    try {
        const { groupId, selectedIDs } = req.body;

        if(selectedIDs){
            selectedIDs.map(async(ID)=>{
                await db.query(
                    `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`,
                    [groupId, ID]
                );
            });
        }


        res.status(200).json({ message: "User added to group successfully" });
    } catch (error) {
        console.error("Error in addMember: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { group_id, user_id } = req.body;

        await db.query(
            `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`,
            [group_id, user_id]
        );

        res.status(200).json({ message: "User removed from group" });
    } catch (error) {
        console.error("Error in removeMember: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { groupId } = req.params;
        const senderId = req.user.id;

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Insert the message and fetch sender details
        const { rows } = await db.query(
            `INSERT INTO group_messages (group_id, sender_id, text, image) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, group_id, sender_id, text, image, created_at`,
            [groupId, senderId, text, imageUrl]
        );

        const message = rows[0];

        // Fetch sender's profile details
        const { rows: senderRows } = await db.query(
            `SELECT fullname, profilepic FROM users WHERE id = $1`,
            [senderId]
        );

        const sender = senderRows[0];

        // Merge sender details with the message
        const fullMessage = { ...message, fullname: sender.fullname, profilepic: sender.profilepic };

        // Emit message to the group room
        io.to(`group_${groupId}`).emit("newGroupMessage", fullMessage);

        res.status(201).json(fullMessage);
    } catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;

        const { rows } = await db.query(
            `SELECT gm.id AS message_id, gm.*, u.fullname, u.profilepic 
             FROM group_messages gm 
             JOIN users u ON gm.sender_id = u.id 
             WHERE gm.group_id = $1 
             ORDER BY gm.created_at ASC`,
            [groupId]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error in getGroupMessages: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        const { rows } = await db.query(
            `SELECT g.* FROM groups g 
             JOIN group_members gm ON g.id = gm.group_id 
             WHERE gm.user_id = $1`,
            [userId]
        );
        
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error in getUserGroups: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
