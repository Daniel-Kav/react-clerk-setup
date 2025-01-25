import { createRoute } from "@hono/zod-openapi";
import { openLoginResponseSchema, openLoginUserSchema, openMessageSchema, openRegisterUserSchema,openRequestPasswordResetSchema,openTokenSchema } from "../openApi/openApiSchemas";

export const registerNewUserRouter = createRoute({
    method: "post",
    path: "/api/v1/auth/sign-up",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: openRegisterUserSchema,
                },
            },
            description: "User registration details",
        },
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openMessageSchema,
                },
            },
            description: "User registration successful",
        },
    },
})

export const registerNewUserResponce = (c: any) => {
    return c.json({
        message: "Registration successful. Please verify your email."
    }, 200)
}

export const signInUserRouter = createRoute({
    method: "post",
    path: "/api/v1/auth/sign-in",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: openLoginUserSchema,
                },
            },
            description: "User login details",
        },
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openLoginResponseSchema,
                },
            },
            description: "User login successful",
        },
    },
})

export const signInUserResponce = (c: any) => {
    return c.json(
        {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmIyODUxZTEtNjJhNS00MzMwLTk5ZmMtMjFhNzk2YTJmNmQ3Iiwicm9sZSI6InVzZXIifQ.06yoDSKfK1Kc8IgABOoVmm37LTlE6JKwhMupAlwApsY",
            user: {
                "user_id": "fb2851e1-62a5-4330-99fc-21a796a2f6d7",
                "email": "reyhanmark0@gmail.com",
                "role": "user"
            }
        }, 200)
}

export const resendVerificationRouter = createRoute({
    method: "post",
    path: "/api/v1/auth/reset-password",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: openRequestPasswordResetSchema
                },
            },
            description: "User email to resend verification",
        },
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Password reset link sent to your email",
                            },

                        }
                    }
                },
            },
            description: "Verification email resent",
        },
    }
})

export const resendVerificationResponce = (c: any) => {
    return c.json({
        message: "Verification email resent"
    }, 200)
}

export const verifyEmailRouter = createRoute({
    method: "get",
    path: "/api/v1/auth/verify-email",
    request: {
        query: openTokenSchema
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Email verification successful",
                            },
                        },
                    },
                },
            },
            description: "Email verification successful",
        },
    },
})

export const verifyEmailResponce = (c: any) => {
    return c.json({
        message: "Email verification successful"
    }, 200)
}

export const googleOAuthCallbackRouter = createRoute({
    method: "get",
    path: "/api/v1/auth/google/callback",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openLoginResponseSchema,
                },
            },
            description: "Google OAuth successful",
        },
    },
})

export const googleOAuthCallbackResponce = (c: any) => {
    return c.json(
        {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmIyODUxZTEtNjJhNS00MzMwLTk5ZmMtMjFhNzk2YTJmNmQ3Iiwicm9sZSI6InVzZXIifQ.06yoDSKfK1Kc8IgABOoVmm37LTlE6JKwhMupAlwApsY",
            user: {
                "user_id": "fb2851e1-62a5-4330-99fc-21a796a2f6d7",
                "email": "reyhanmark0@gmail.com",
                "role": "user"
            }
        }, 200)
}

export const resetPasswordRouter = createRoute({
    method: "get",
    path: "/api/v1/reset-password/confirm",
    request: {
        query: openTokenSchema
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Password reset successful",
                            },
                        },
                    },
                },
            },
            description: "Password reset successful",
        },
    },
})

export const resetPasswordResponce = (c: any) => {
    return c.json({
        message: "Password reset successful"
    }, 200)
}
