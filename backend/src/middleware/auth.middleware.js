import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../libs/db.js";

dotenv.config();

export const protectRoute= (req,res,next)=>{
    const token=req.cookies['jwt'];
    if(!token){
        res.status(401).json({success:false,message:"Unauthorized -No token provided"});
    }
    try {
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        if(!decoded){
            res.status(401).json({success:false,message:"Unauthorized -Invalid token"});
        }
        const { rows }=db.query('SELECT * from users where id=$1',[decoded.userID]);

        if(rows.length<=0){
            res.status(404).json({success:false,message:"User not found"});
        }

        req.user={id:rows[0].id, fullName:rows[0].fullname, email:rows[0].email};
        next();
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"});
    }
}