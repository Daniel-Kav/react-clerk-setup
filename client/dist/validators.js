"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters long').nonempty('Username is required'),
    email: zod_1.z.string().email('Invalid email format').nonempty('Email is required'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').nonempty('Password is required'),
    confirmPassword: zod_1.z.string()
        .nonempty('Confirm Password is required')
});
