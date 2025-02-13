import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { generateToken } from "../libs/utils.js";
import cloudinary from "../libs/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, password, email } = req.body;
    
    try {
        if (!fullName || !password || !email) {
            return res.status(400).json({ success: false, message: "Empty fields" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be greater than 6 characters" });
        }

        // Check if the user already exists
        const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: "User already exists, Please head over to login page" });
        }

        // Hash the password
        const saltRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // Insert new user
        const result = await db.query(
            "INSERT INTO users (email, password, fullname) VALUES ($1, $2, $3) RETURNING id, fullname, profilepic",
            [email, hashedPassword, fullName]
        );

        const user = result.rows[0];

        // Generate token
        generateToken(user.id, res);

        return res.status(201).json({ success: true, user, message:"User successfully created" });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const login = async (req, res) => {
    const {email,password}=req.body;
    try {
        const { rows }=await db.query('SELECT * from users where email=$1',[email]);
        if(rows.length>0){
            const user=rows[0];
            const isPasswordCorrect= await bcrypt.compare(password, user.password);
            if(isPasswordCorrect){
                generateToken(user.id,res);
                res.status(200).json({ success: true, user:{id:user.id, email:user.email, fullName:user.fullname}, message:"User login success" });
            }else{
                res.status(400).json({ success: false, message:"Invalid Credentials" });
            }
        }
        else{
            res.status(400).json({ success: false, message:"Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message:"Internal Server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({success:true,message:"Logout successfull"});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"});
    }
};

export const updateProfile = async (req, res) => {
    const { profilepic } = req.body;
    
    if (!profilepic) {
        return res.status(400).json({ message: "Empty field", success: false });
    }

    try {
        // Upload image to Cloudinary
        const response = await cloudinary.uploader.upload(profilepic);

        // Update user's profile picture in the database
        const { rows } = await db.query(
            `UPDATE users SET profilepic = $1 WHERE id = $2 RETURNING id, fullname, email, profilepic`,
            [response.secure_url, req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const updatedUser = rows[0];

        return res.status(200).json({ 
            message: "Profile updated successfully", 
            success: true, 
            user: updatedUser 
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const check= (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller", error.message);
        res.status(500).json({message:"Internal Server error",success:false});
    }
}