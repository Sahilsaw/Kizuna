import { db } from "../libs/db.js";
import { getReceiverSocketId,io } from "../libs/socket.js";
import cloudinary from "../libs/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
      const loggedInUserId = req.user.id;
      const { rows: filteredUsers } = await db.query(
        "SELECT id, email, fullname, profilepic FROM users WHERE id <> $1",
        [loggedInUserId]
    );
  
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
};

export const getChat= async(req,res)=>{
    try {
        const myID= req.user.id;
        const receiverID= req.params.id;
        const { rows: filteredMessages } = await db.query(
            `SELECT * FROM messages 
            WHERE (sender_id = $1 AND receiver_id = $2) 
               OR (sender_id = $2 AND receiver_id = $1) 
            ORDER BY created_at ASC`,
            [myID, receiverID]
        );
        res.status(200).json(filteredMessages);
    } catch (error) {
        console.log("Error fetching message",error.message);
        res.status(500).json({message:"Internal Server Error", success:false})
    }
}

export const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user.id; 
  
      let imageUrl = null;
      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const { rows } = await db.query(
        `INSERT INTO messages (sender_id, receiver_id, text, image) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [senderId, receiverId, text, imageUrl]
      );
  
      const receiverSocketID= getReceiverSocketId(receiverId);

      io.to(receiverSocketID).emit("newMessage",rows[0]);

      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error in sendMessage controller:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  