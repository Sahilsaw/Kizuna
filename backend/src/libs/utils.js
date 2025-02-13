import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey=process.env.SECRET_KEY;
export const generateToken=(userID,res)=>{
    const token=jwt.sign({userID},secretKey,{expiresIn:'7d',});
    res.cookie('jwt',token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV === "production",
    });
}