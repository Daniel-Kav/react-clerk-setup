import { HTTPException } from "hono/http-exception";
import { checkStudentEmailInVerificationsService, checkStudentInVerificationsService, createVerfiyStudentService, getVerfiyStudentByIdService } from "./verifyStudent.services";
import { Context } from "hono";
import { getUniversityByIdService } from "../universities/uni.services";
import { sendVerificationToken } from "../utils/token";

// export const verifyStudentController = async (c: Context) => {
//     try {
//         let data = await c.req.json();

//         let university = await getUniversityByIdService(data.university_id);
//         if (university) {
//             return c.json({
//                 message: "University not found"
//             }, 404);
//         }
//         let student = await checkStudentInVerificationsService(data.user_id);
//         if (student) {
//             return c.json({
//                 message: "Verification already submitted"
//             }, 404);
//         }
//         const { userId, school_id_card,documents } = data;

//        await createVerfiyStudentService({
//         user_id: userId,
//         school_id_card: school_id_card
//         });

//         if (!school_id_card && documents) {
//             const docSaves = documents.map(async (doc:any) => {
//                 await createDocumentService({
//                     verification_id: userId,
//                     document_type: doc.document_type,
//                     document_url: doc.document_url
//                 });
//             });
//         }

//         return c.json({
//             message: "Verification submitted successfully"
//         }, 200);
//     }
//     catch (error) {
//         console.log(error);
//         throw new HTTPException(400, { message: "Unable to complete the request, please try again...." });
//     }
// }

//verify student email
export const verifyStudentEmailController = async (c: Context) => {
    try {
        const { email } = await c.req.json();
        const student = await checkStudentEmailInVerificationsService(email);
        if (!student) {
            return c.json({ message: "Student not found" }, 404);
        }

        if (student.student_email_verified) {
            return c.json({ message: "Email already verified" }, 400);
        }
        
        let response = await sendVerificationToken(student,'student');

        return c.json({ message: response }, 200);
    } catch (error) {
        console.log(error);
        throw new HTTPException(400, { message: "Unable to resend verification email" });
    }
}
