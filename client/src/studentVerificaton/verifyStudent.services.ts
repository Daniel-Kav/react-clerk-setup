import { eq } from "drizzle-orm"
import db from "../drizzle/db"

import { studentVerifications,TIstudentVerifications,TSstudentVerifications } from "../drizzle/schema"

export const getVerfiyStudentsService = async (): Promise<TSstudentVerifications[]> => {
    return await db.query.studentVerifications.findMany();
}

export const getVerfiyStudentByIdService = async (id: string) : Promise<TSstudentVerifications | undefined> => {
    const game = await db.query.studentVerifications.findFirst({
         where: eq(studentVerifications.verification_id, id)
    });
    return game || undefined;
}

export const checkStudentInVerificationsService = async (id: string) : Promise<TSstudentVerifications | undefined> => {
    const student = await db.query.studentVerifications.findFirst({
         where: eq(studentVerifications.user_id, id)
    });
    return student;
}

export const checkStudentEmailInVerificationsService = async (email: string) : Promise<TSstudentVerifications | undefined> => {
    const student = await db.query.studentVerifications.findFirst({
         where: eq(studentVerifications.student_email, email)
    });
    return student || undefined;
}

export const createVerfiyStudentService = async (data: TIstudentVerifications) :Promise<TIstudentVerifications> => {
    const [newVerfiyStudent] = await db.insert(studentVerifications).values(data).returning();
    return newVerfiyStudent;
}

export const deleteVerfiyStudentByIdService = async (id: string): Promise<boolean> => {
    await db.delete(studentVerifications).where(eq(studentVerifications.verification_id, id))
    return true;
}

export const updateVerfiyStudentService = async (id: string, data: TIstudentVerifications): Promise<TSstudentVerifications | undefined> => {
    await db.update(studentVerifications).set(data).where(eq(studentVerifications.verification_id, id)) 
    const updatedVerfiyStudent = await db.query.studentVerifications.findFirst({
        where: eq(studentVerifications.verification_id, id)
    });
    return updatedVerfiyStudent || undefined;
}