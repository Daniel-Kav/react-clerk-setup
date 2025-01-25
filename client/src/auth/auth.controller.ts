import { Context } from "hono";
import "dotenv/config";
import bcrypt from 'bcrypt';
import { sign } from "hono/jwt";
import { checkIfExistingEmailService, checkTokenService, createAuthUserService, SUser, TAuth, updateAuthUserService } from "./auth.services";
import { HTTPException } from 'hono/http-exception'
import { generateJwtToken } from "../utils/jwt";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/email";
import crypto from 'crypto';
import { sendVerificationToken } from "../utils/token";
import { authSchema, authSigninSchema, emailSchema, passwordSchema } from "../validators";
import Logger from "../utils/logger";
// import { emailQueue } from "../utils/bullMq";
// import { emailConfigs } from "../workers/email.worker";

export interface TDecoded {
    user_id: string;
    email: string;
    role: string;
}
export interface Tuser {
    email: string;
    password: string;
}

const generateToken = (): string => crypto.randomBytes(32).toString('base64url');
const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};


export const signUpUserController = async (c: Context) => {
    try {

        const userData = authSchema.parse(await c.req.json());
        userData.email = userData.email.toLowerCase()

        const existingUser = await checkIfExistingEmailService(userData.email);
        if (existingUser) {
            Logger.warn(`Signup attempt with existing email: ${userData.email}`);
            throw new HTTPException(409, { message: 'Email already in use' });
        }

        const hashedPassword = hashPassword(userData.password);
        const token = generateToken();
        const tokenExpiry = new Date(Date.now() + 3600000);

        const user = await createAuthUserService({
            ...userData,
            password: hashedPassword,
            email_verification_token: token,
            email_verification_expires: tokenExpiry
        });

        if (!user) {
            throw new HTTPException(500, { message: 'Failed to create user' });
        }

        //      await emailQueue.add('email', {
        //   to: user.email,
        //   type: 'VERIFICATION',
        //   token
        // }, {
        //   priority: 1,
        //   attempts: 3,
        //   backoff: {
        //     type: 'exponential',
        //     delay: 1000
        //   }
        // });

        await sendVerificationEmail(user.email, token);
        Logger.info(`User registered successfully: ${user.email}`);
        return c.json({
            message: 'Registration successful. Please verify your email.',
            status: 201
        }, 201);

    } catch (e: any) {
        console.log(e)
        return c.json({
            message: "Unable to complete the request, please try again",
            status: 400
        }, 400);
    }
}

export const signInUserController = async (c: Context) => {
    try {
        const credentials = authSigninSchema.parse(await c.req.json());
        credentials.email = credentials.email.toLowerCase();

        const user = await checkIfExistingEmailService(credentials.email);
        if (!user) {
            Logger.warn(`Login attempt with non-existent email: ${credentials.email}`);
            throw new HTTPException(401, { message: 'Invalid credentials' });
        }

        if (!bcrypt.compareSync(credentials.password, user.auths.password_hash)) {
            Logger.warn(`Failed login attempt for user: ${credentials.email}`);
            throw new HTTPException(401, { message: 'Invalid credentials' });
        }

        const payload = {
            userId: user.user_id,
            universityId: user.university_id,
            role: user.auths.role
        }

        const AUser = {
            user_id: user.user_id,
            email: credentials.email,
            role: user.auths.role
        }

        return c.json({
            token: generateJwtToken(payload),
            user: AUser,
            status: 200

        }, 200);
    } catch (error) {
        Logger.error('Signin error:', error);
        return c.json({
            message: 'Unable to complete signin',
            status: 500
        }, 500);
    }
}

export const resendVerificationController = async (c: Context) => {

    try {
        const { email } = emailSchema.parse(await c.req.json());
        const user = await checkIfExistingEmailService(email);
        if (!user) {
            Logger.warn(`Verification resend attempt for non-existent email: ${email}`);
            throw new HTTPException(404, { message: 'User not found' });
        }

        if (user.auths.email_verified) {
            Logger.warn(`Verification resend attempt for verified email: ${email}`);
            throw new HTTPException(400, { message: 'Email already verified' });
        }
        const token = generateToken();
        const tokenExpiry = new Date(Date.now() + 3600000);

        // Update user with new token
        await updateAuthUserService(user.auths.auth_id, {
            email_verification_token: token,
            email_verification_expires: tokenExpiry
        });

        // Queue verification email
        // await emailQueue.add('email', {
        //     to: email,
        //     type: 'VERIFICATION',
        //     token
        // }, {
        //     priority: 1,
        //     attempts: 3,
        //     backoff: {
        //         type: 'exponential',
        //         delay: 1000
        //     }
        // });
        await sendVerificationToken(user, 'user');

        Logger.info(`Verification email resent to: ${email}`);

        return c.json({
            message: 'Verification email sent',
            status: 200
        }, 200);
    } catch (error) {
        Logger.error('Resend verification error:', error);
        return c.json({
            message: 'Failed to resend verification email',
            status: 500
        }, 500);
    }
}

//google sign-in
export const googleSignInController = async (c: Context) => {
    try {
        const token = c.get('token')
        const googleUser = c.get('user-google');

        if (!googleUser || !token) {
            Logger.warn('Google sign-in attempt without valid token/user data');
            throw new HTTPException(400, {
                message: "Invalid Google authentication data"
            });
        }

        //check if email exists
        let user = await checkIfExistingEmailService(googleUser.email!) as TAuth;

        if (!user) {
            //create new user
            const newUser = await createAuthUserService({
                full_name: googleUser.name!,
                email: googleUser.email!,
                email_verified: true,
                password: crypto.randomBytes(32).toString('hex'),
                contact_phone: '',
            });

            if (!newUser) {
                throw new HTTPException(500, { message: 'Failed to create user' });
            }

            Logger.info(`New user created from Google sign-in: ${googleUser.email}`);
            user = {
                user_id: newUser.user_id,
                university_id: newUser.university_id,
                auths: {
                    role: newUser.auths.role,
                    auth_id: "",
                    user_id: "",
                    password_hash: "",
                    email_verified: null,
                    email_verification_token: null,
                    reset_password_token: null,
                    reset_password_expires: null
                }
            }
        }

        const payload = {
            userId: user.user_id,
            universityId: user.university_id,
            role: user.auths.role
        };

        const userData = {
            user_id: user.user_id,
            email: googleUser.email,
            role: user.auths.role
        };

        Logger.info(`Google sign-in successful: ${googleUser.email}`);
        return c.json({
            token: generateJwtToken(payload),
            user: userData,
            status: 200
        }, 200);

    } catch (e) {
        console.log(e)
        throw new HTTPException(400, { message: "Unable to complete the request, please try again...." });
    }
}

export const verifyEmailController = async (c: Context) => {
    try {
        const token = c.req.query('token');

        if (!token) {
            Logger.warn('Email verification attempt without token');
            throw new HTTPException(400, { message: "Verification token is required" });
        }

        const user = await checkTokenService(token, 'verification');
        if (!user) {
            Logger.warn(`Invalid verification token attempt: ${token}`);
            throw new HTTPException(400, { message: 'Invalid or expired token' });
        }

        const updatedUser = await updateAuthUserService(user.auth_id, {
            email_verified: true,
            email_verification_token: null,
            email_verification_expires: null
        });


        const payload = {
            user_id: user.user_id,
            university_id: user.user.university_id,
            role: user.role
        }

        Logger.info(`Email verified successfully for user: ${user.user.email}`);
        return c.json({
            token: await generateJwtToken(payload),
            user: {
                user_id: user.user_id,
                email: user.user.email,
                role: user.role
            },
            status: 200
        }, 200);

    } catch (error) {
        Logger.error('Email verification error:', error);
        return c.json({
            message: "Email verification failed",
            status: 500
        }, 500);
    }
}

export const passwordResetController = async (c: Context) => {
    try {
        const { email } = emailSchema.parse(await c.req.json());
        const user = await checkIfExistingEmailService(email);

        if (!user) {
            Logger.warn(`Password reset attempt for non-existent email: ${email}`);
            return c.json({ message: 'If email exists, reset instructions will be sent' }, 200);
          }
      
          const token = generateToken();
          const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await updateAuthUserService(user.auths.auth_id, {
      reset_password_token: token,
      reset_password_expires: tokenExpiry
    });
    // await emailQueue.add('email', {
    //     to: email,
    //     type: 'PASSWORD_RESET',
    //     token
    //   }, { priority: 1 });

        await sendPasswordResetEmail(email, token);

        Logger.info(`Password reset email sent to: ${email}`);
        return c.json({
            message: 'Password reset link sent to your email',
            status: 200,
        }, 200);

    } catch (error) {
        Logger.error('Password reset request error:', error);
        return c.json({ message: 'Unable to process request' }, 500);
    }
};
export const resetPasswordController = async (c: Context) => {
    try {
        const token = c.req.query('token');
        if (!token) {
            throw new HTTPException(400, { message: 'Token is required' });
        }
        const { password } = passwordSchema.parse(await c.req.json());

        const user = await checkTokenService(token, 'reset');
        if (!user || !user.reset_password_expires ||
            new Date() > new Date(user.reset_password_expires)) {
            throw new HTTPException(400, { message: 'Invalid or expired token' });
        }

        const hashedPassword = hashPassword(password);
        await updateAuthUserService(user.auth_id, {
            password_hash: hashedPassword,
            reset_password_token: null,
            reset_password_expires: null
        });

        // await emailQueue.add('email', {
        //     to: user.user.email,
        //     type: 'PASSWORD_CHANGED',
        //     data: { name: user.user.full_name }
        // }, { priority: 1 });

        Logger.info(`Password reset successful for user: ${user.user.email}`);
        return c.json({
            message: 'Password reset successful',
            status: 200,
        }, 200);

    } catch (error) {
        Logger.error('Password reset error:', error);
        throw new HTTPException(400, { message: 'Unable to complete the request, please try again' });
    }
}