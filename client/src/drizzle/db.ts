import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export const sql = neon(process.env.DATABASE_URL as string) //*neon
const db = drizzle(sql, { schema, logger: true }) 


export default db; 