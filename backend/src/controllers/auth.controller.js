import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { generateToken } from "../libs/utils.js";

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

export const updateProfile= async(req,res)=>{
    const {prpfilepic}=req.body;
}
