import { app,server } from "./libs/socket.js";
import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import cors from "cors";
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();


const PORT= process.env.PORT;

app.use(express.json({ limit: "10mb" }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/messages',messageRouter);

server.listen(PORT,()=>{
  console.log(`Listening on PORT ${PORT}`);
})