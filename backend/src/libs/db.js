import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export const db = new pg.Client({
    connectionString: process.env.DATABASE_URL, 
    ssl: {
        rejectUnauthorized: false, 
    }
});

export async function connectDB() {
    try {
        await db.connect();
        console.log("Successfully connected to Neon DB");
    } catch (error) {
        console.error("Error connecting to DB:", error.message);
    }
}
