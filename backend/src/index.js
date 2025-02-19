import { app,server } from "./libs/socket.js";
import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import path from "path"

const __dirname= path.resolve();

dotenv.config();


const PORT= process.env.PORT;

app.use(express.json({ limit: "100mb" }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/messages',messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT,()=>{
  console.log(`Listening on PORT ${PORT}`);
})