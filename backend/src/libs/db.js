import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5, // Limit pool size to avoid Neon connection limits
    idleTimeoutMillis: 10000, // Close idle connections after 10s
});

db.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});
