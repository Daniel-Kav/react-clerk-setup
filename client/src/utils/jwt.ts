import { sign, verify } from "hono/jwt";
import { HTTPException } from 'hono/http-exception';

export const generateJwtToken = async (payload: any): Promise<string> => {

    try {
        let secret = process.env.JWT_SECRET as string;
        const token = await sign(payload, secret);
        return token;

    } catch (error) {
        throw new HTTPException(500, { message: 'Failed to generate verification token' });
    }
}

export const decodeToken = async (token: string): Promise<any> => {
    try {
        const decoded = await verify(token, process.env.JWT_SECRET as string);
        return decoded;
    } catch (error) {
        throw new HTTPException(400, { message: 'Invalid token' });
    }
}