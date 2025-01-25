import { eq } from "drizzle-orm"
import db from "../drizzle/db"

import { users,TIusers,TSusers } from "../drizzle/schema"
import { TUser } from "../auth/auth.services";

export const getUsersService = async (limit?:number): Promise<TSusers[]> => {
    return limit 
    ? await db.query.users.findMany({ limit })
    : await db.query.users.findMany();
}

export const getUserByIdService = async (id: string): Promise<TUser | undefined> => {
    return await db.query.users.findFirst({
      where: eq(users.user_id, id),
      with: {
        auths: {
          columns: {
            user_id: true,
            email_verified: true,
            role: true
          }
        },
        preferences: {
          columns: {
            preference_id: true,
            type: true,
            opted_in: true,
            is_student_seller_only: true
          }
        }
      }
    })
  }

export const createUserService = async (data: TIusers) :Promise<TIusers> => {
    
    const [newUser] = await db.insert(users).values(data).returning();
    return newUser;

}

export const deleteUserByIdService = async (id: string): Promise<boolean> => {
    await db.delete(users).where(eq(users.user_id, id))
    return true;
}

export const updateUserService = async (id: string, data: TIusers): Promise<TSusers | undefined> => {
    await db.update(users).set(data).where(eq(users.user_id, id)) 
    const updatedUser = await db.query.users.findFirst({
        where: eq(users.user_id, id)
    });
    return updatedUser || undefined;
}