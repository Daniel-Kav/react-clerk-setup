import "dotenv"
import { Config, defineConfig } from "drizzle-kit";

if (!("Database_URL" in process.env)) {
    throw new Error("Database URL not found in .env file");
}

export default defineConfig({
    dialect: "postgresql",   //'sqlite','mysql2',
    schema: './src/drizzle/schema.ts',
    out: "./src/drizzle/migrations",
    dbCredentials: {
        url: process.env.Database_URL as string,
    },
    verbose: true,
    strict: true,

}) satisfies Config;