import "dotenv/config"
import { Context, Next} from "hono"
import { decodeToken } from "../utils/jwt";
import {} from "../"



export interface ITokenPayload {
    userId: number;
    username: string;
    role: "admin" | "user" | "super_admin";
    exp?: number; // expiration time
}


export const authorize = async (c: Context, next: Next, requiredRole: string) => {


    try {
    const token = c.req.header("Authorization")?.split(" ")[1]; // Expects "Bearer <token>"
    if (!token) {
        return c.json({ error: "No token provided" }, 401);
    }

    let decoded: ITokenPayload;
    try {
        decoded = await decodeToken(token);
        if (!decoded) {
            return c.json({ error: "Invalid token" }, 401);
        }
    } catch (error) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return c.json({ error: "Token has expired" }, 401);
    }


    const { role } = decoded;
    if (role !== requiredRole && role !== "admin" && role !== "super_admin") {
        return c.json({ error: "Unauthorized" }, 403);
    }

    // Attach user details to the context for downstream use
    c.set("user", decoded);

    // Proceed to the next middleware or route handler
    await next();
} catch (error) {
    console.error("Error authorizing user:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
}

// Middleware to authorize admin
export const authorizeAdmin = async (c: Context, next: Next) => await authorize(c, next, "admin");

// Middleware to authorize user
export const authorizeUser = async (c: Context, next: Next) => await authorize(c, next, "user");

// Middleware to authorize super admin
export const authorizeSuperAdmin = async (c: Context, next: Next) => await authorize(c, next, "super_admin");