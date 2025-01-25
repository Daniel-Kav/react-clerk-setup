import { Context } from "hono";
import { getAllController, getController, createController,deleteController,updateController } from "../generics/gen.controller";
import { createUniversity, deleteUniversity, getUniversities, getUniversityByIdService, getUniversityFromEmail, updateUniversity } from "./uni.services";
import { checkStudentEmailInVerificationsService } from "../studentVerificaton/verifyStudent.services";


export const getAllUnisController = getAllController(getUniversities);
export const getUniController = getController(getUniversityByIdService);
export const createUniController = createController(createUniversity);
export const updateUniController = updateController(getUniversityByIdService,updateUniversity);
export const deleteUniController = deleteController(getUniversityByIdService,deleteUniversity);

export const getUniFromEmailController = async (c: Context) => {
    const email = await c.req.json()
    if (!email) {
        return c.json({message: 'Email is required'}, 400)
    }
    const domain = email.split('@')[1]
    try {
        const uni = await getUniversityFromEmail(domain)
        if (!uni) return c.json({message: 'No university found for this email domain'}, 404)
        
        const existingUser = await checkStudentEmailInVerificationsService(email);
        if (existingUser) {
            return c.json({message: "This email is already associated with another account."}, 400);
        }
        
        return c.json(uni, 200)
    } catch (error) {
        console.error(error)
        return c.json({message: 'An error occurred'}, 500)
    }
}
