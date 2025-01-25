import { HTTPException } from "hono/http-exception";
import { updateAuthUserService } from "../auth/auth.services";
import { sendStudentVerificationEmail, sendVerificationEmail } from "./email";
import crypto from 'crypto';
import { createVerfiyStudentService } from "../studentVerificaton/verifyStudent.services";

const generateToken = () => crypto.randomBytes(32).toString('base64url');

const setVerificationDetails = (entity: any, token: string, expiresIn: number = 3600000) => {
    entity.email_verification_token = token;
    entity.email_verification_expires = new Date(Date.now() + expiresIn);
};

export const sendVerificationToken = async (entity: any, type: 'user' | 'student'): Promise<string> => {
    try {
        const token = generateToken();
        setVerificationDetails(entity, token);

        if (type === 'user') {
            await updateAuthUserService(entity.user_id, entity);
            await sendVerificationEmail(entity.email, token);
        } else if (type === 'student') {
            await createVerfiyStudentService(entity);
            await sendStudentVerificationEmail(entity.student_email, token);
        }

        return "Verification email sent successfully";
    } catch (error) {
        throw new HTTPException(400, { message: "Unable to complete the request, please try again...."
         });
    }
};
