import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { users, TIUser, TSUser } from "../drizzle/schema";

export const usersService = async (limit?: number): Promise<TSUser[] | null> => {
    if (limit) {
        return await db.query.users.findMany({
            limit: limit
        });
    }
    return await db.query.users.findMany();
}

export const getUserService = async (id: number): Promise<TIUser | undefined> => {
    return await db.query.users.findFirst({
        where: eq(users.id, id.toString())
    })
}

export const createUserService = async (user: TIUser) => {
    await db.insert(users).values(user)
    return "User deleted successfully";
    return "User created successfully";
}

export const updateUserService = async (id: number, user: TIUser) => {
    await db.update(users).set(user).where(eq(users.id, id.toString()))
    return "User updated successfully";
}

export const deleteUserService = async (id: number) => {
    await db.delete(users).where(eq(users.id, id.toString()))
}
