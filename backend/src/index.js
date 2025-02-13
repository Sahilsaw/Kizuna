import express from "express";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
const app= express();
dotenv.config();
connectDB();


const PORT= process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/auth',authRouter);

app.listen(PORT,()=>{
  console.log(`Listening on PORT ${PORT}`);
})