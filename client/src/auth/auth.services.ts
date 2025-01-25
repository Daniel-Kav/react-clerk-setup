import { eq, gt, } from "drizzle-orm";
import db from "../drizzle/db";
import { auths, TIauth, TSusers, users } from "../drizzle/schema";
import { HTTPException } from "hono/http-exception";
import { createDefaultPreferences } from "../preferences/preference.service";
import { getUserByIdService } from "../users/users.services";

export interface TUser {
  user_id: string;
  full_name: string;
  email: string;
  contact_phone: string;
  university_id: string | null;
  discord_name: string | null;
  gamertag: string | null;
  is_profile_complete: boolean | null;
  auths: {
    user_id: string;
    email_verified: boolean | null;
    role: string;
  };
  preferences: Array<{
    preference_id: string;
    type: string;
    opted_in: boolean | null;
    is_student_seller_only: boolean | null;
  }>;
}

export interface TAuth {
  user_id: string;
  university_id: string | null;
  auths: {
    auth_id: string;
    user_id: string;
    password_hash: string;
    email_verified: boolean | null;
    email_verification_token: string | null;
    reset_password_token: string | null;
    reset_password_expires: Date | null
    role: string;
  };
}

export interface TAuthUser {
  auth_id: string;
  user_id: string;
  email_verified: boolean;
  password_hash: string;
  role: "admin" | "user" | "super_admin";
  email_verification_token: string | null;
  reset_password_token: string | null;
  reset_password_expires: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  user: {
    full_name: string;
    university_id: string | null;
    email: string;
  };
}

export interface SUser {
  full_name: string;
  email: string;
  password: string;
  university_id?: string | null;
  contact_phone: string;
  email_verification_token?: string | null;
  email_verification_expires?: Date | null;
  email_verified?: boolean;
  created_at?: Date;
}

export const createAuthUserService = async (user: SUser): Promise<TUser | undefined> => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, user.email),
    columns: { user_id: true }
  });


  if (existingUser) {
    throw new HTTPException(409, { message: 'Email already exists' });
  }

  try {
    const [newUser] = await db.insert(users).values({
      full_name: user.full_name,
      email: user.email,
      university_id: user.university_id,
      contact_phone: user.contact_phone,
      created_at: new Date()
    }).returning();
    
    const [authId] = await db.insert(auths).values(
      {
        user_id: newUser.user_id,
        password_hash: user.password,
        email_verification_token: user.email_verification_token,
        email_verified: false,
        created_at: new Date(),
      }
    ).returning({ user_id: auths.user_id });

    await createDefaultPreferences(newUser.user_id);
    return await getUserByIdService(authId.user_id);

  } catch (error) {
    console.log("🚀 ~ createAuthUserService ~ error", error)
    throw new HTTPException(500, { message: 'Failed to create user' });

  }
}

export const checkTokenService = async (token: string, type: 'verification' | 'reset'): Promise<TAuthUser | undefined> => {
  const conditions = type === 'verification'
    ? { tokenField: auths.email_verification_token, expiresField: auths.email_verification_expires }
    : { tokenField: auths.reset_password_token, expiresField: auths.reset_password_expires };

  const user = await db.query.auths.findFirst({
    where: eq(conditions.tokenField, token) && gt(conditions.expiresField, new Date()),
    with: {
      user: {
        columns: {
          full_name: true,
          university_id: true,
          email: true,
        }
      }
    }
  });
  return user;
}

export const checkIfExistingEmailService = async (email: string): Promise<TAuth | undefined> => {
  const userExists = await db.query.users.findFirst({
    columns: {
      user_id: true,
      university_id: true
      
    },
    where: eq(users.email, email),
    with: {
      auths: {
        columns: {
          auth_id: true,
          user_id: true,
          password_hash: true,
          email_verified: true,
          email_verification_token: true,
          reset_password_token: true,
          reset_password_expires: true,
          role: true
        }
      }
    }
  });

  return userExists;
}

export const updateAuthUserService = async (id: string, authUser: Partial<TIauth>): Promise<string | undefined> => {
  await db.update(auths).set(authUser).where(eq(auths.auth_id, id));
  return `User updated successfully`;
}
export const getUsersService = async (limit?: number): Promise<TSusers[] | undefined> => {
  if (limit) {
    return await db.query.users.findMany({
      limit: limit
    })
  }
  return await db.query.users.findMany()
}



export const updateUserService = async (id: string, user: TSusers): Promise<string | undefined> => {
  await db.update(users).set(user).where(eq(users.user_id, id))
  return user.full_name ? `${user.full_name} updated successfully` : undefined;
}

export const DeleteUsersByIdService = async (id: string): Promise<string | undefined> => {
  //query the users table and delete the users with the id
  const [delUser] = await db.delete(users).where(eq(users.user_id, id)).returning({ fullname: users.full_name })
  return `${delUser?.fullname}, has been deleted successfully`
}

