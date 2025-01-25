import { Hono } from 'hono';
import { googleAuth } from '@hono/oauth-providers/google';
import 'dotenv/config';
import { googleSignInController, passwordResetController, resetPasswordController, signInUserController, signUpUserController, verifyEmailController } from './auth.controller';
import { zValidator } from '@hono/zod-validator';
import { authSchema, authSigninSchema } from '../validators';

const authsRouter = new Hono();

//sign up
authsRouter.post('/auth/sign-up',zValidator('json',authSchema,(result,c)=>{
    if(!result.success){
        return c.json(result.error,400)
    }

}), signUpUserController);

authsRouter.post('/auth/sign-in',zValidator('json',authSigninSchema,(result,c)=>{
    if(!result.success){
        return c.json(result.error,400)
    }
}), signInUserController);

authsRouter.get('/auth/verify-email', verifyEmailController); 

authsRouter.get('/auth/google/callback', 
    googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
    scope: ['email' ,'profile' ,'openid'],
    prompt: 'consent'
}));

authsRouter.get('/auth/google/callback',googleSignInController);
authsRouter.get('/reset-password/confirm', resetPasswordController);
authsRouter.post('/reset-password', passwordResetController);

export default authsRouter;