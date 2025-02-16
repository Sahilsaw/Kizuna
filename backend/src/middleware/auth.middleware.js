import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../libs/db.js";

dotenv.config();

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message: "Unauthorized - No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return res.status(401).json({message: "Unauthorized - Invalid token" });
        }

        const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [decoded.userID]);

        if (rows.length === 0) {
            return res.status(404).json({message: "User not found" });
        }

        req.user = {
            id: rows[0].id,
            fullName: rows[0].fullname,
            email: rows[0].email,
            profilePic:rows[0].profilepic,
            createdAt:rows[0].created_at,
        };

        next(); // Move to the next middleware

    } catch (error) {
        console.error("Error in protectRoute:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};