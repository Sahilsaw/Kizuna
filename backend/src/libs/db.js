import pg from "pg";
import dotenv  from "dotenv"
dotenv.config();

export const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export async function connectDB(){
    try {
        await db.connect();
        console.log("Successfully connected to DB");
    } catch (error) {
        console.error("Error connecting to DB:", error.message);
    }
}