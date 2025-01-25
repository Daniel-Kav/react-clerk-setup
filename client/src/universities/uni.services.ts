import { eq } from "drizzle-orm"
import db from "../drizzle/db"
import { universities, TIuniversities, TSuniversities } from "../drizzle/schema"


interface UniEmail { 
    university_name: string;
    university_logo_url: string | null;
    location: string | null;
    region: string;
 }

export const getUniversities = async (): Promise<TSuniversities[]> => {
    return await db.query.universities.findMany();
}

export const getUniversityFromEmail = async (domain: string): Promise<UniEmail | undefined> => {
    return await db.query.universities.findFirst({
        columns: {
            university_name: true,
            university_logo_url: true,
            location: true,
            region: true
        },
        where: eq(universities.email_domain, domain)
    });
}

export const getUniversityByIdService = async (id: string): Promise<TSuniversities | undefined> => {
    const university = await db.query.universities.findFirst({
        where: eq(universities.university_id, id)
    });
    return university || undefined;
}

export const createUniversity = async (data: TIuniversities): Promise<TIuniversities> => {

    const [newUniversity] = await db.insert(universities).values(data).returning();
    return newUniversity;

}

export const deleteUniversity = async (id: string): Promise<boolean> => {
    await db.delete(universities).where(eq(universities.university_id, id))
    return true;
}

export const updateUniversity = async (id: string, data: TIuniversities): Promise<TSuniversities | undefined> => {
    await db.update(universities).set(data).where(eq(universities.university_id, id))
    const updatedUniversity = await db.query.universities.findFirst({
        where: eq(universities.university_id, id)
    });
    return updatedUniversity || undefined;
}