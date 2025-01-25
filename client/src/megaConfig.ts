import { Storage } from "megajs";

export const storage = async ()=> {
    return await new Storage({
        email: process.env.MEGA_EMAIL!,
        password: process.env.MEGA_PASSWORD!
    }).ready;
}
