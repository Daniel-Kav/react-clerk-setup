import { createRoute, z } from "@hono/zod-openapi";
import { OpenParamsSchema, openUserSchema, openMessageSchema, openArrayResponseSchema, openSingleResponseSchema } from "../openApi/openApiSchemas";

export const getAllUsersRouter = createRoute({
    method: "get",
    path: "/api/v1/users",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openArrayResponseSchema(openUserSchema, 200, "users")
                }
            },
            description: "List all users"
        }
    }
});

export const getAllUsersResponse = async (c: any) => {
    return c.json({
        status: 200,
        data: [{
            user_id: '',
            full_name: '',
            email: '',
            contact_phone: '',
            university_id: '',
            discord_name: null,
            gamertag: null,
            game_id: null,
            verification_id: null,
            is_profile_complete: false,
            created_at: '',
            updated_at: '',
            auths: {
                user_id: '',
                email_verified: null,
                role: '',
            },
            preferences: [
                {
                    preference_id: '',
                    type: '',
                    opted_in: false,
                    is_student_seller_only: false
                },

            ],
        }
        ]
    })
}

export const getUserRouter = createRoute({
    method: "get",
    path: "/api/v1/users/{id}",
    request: {
        params: OpenParamsSchema
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openSingleResponseSchema(openUserSchema, 200, "user")
                }
            },
            description: "Get user by ID"
        }
    }
});


export const getUserResponse = (c:any) => {
    return c.json({
        status: 200,
        data: {
            user_id: '',
            full_name: '',
            email: '',
            contact_phone: '',
            university_id: '',
            discord_name: null,
            gamertag: null,
            game_id: null,
            verification_id: null,
            is_profile_complete: false,
            created_at: '',
            updated_at: '',
            auths: {
                user_id: '',
                email_verified: null,
                role: '',
            },
            preferences: [
                {
                    preference_id: '',
                    type: '',
                    opted_in: false,
                    is_student_seller_only: false
                },

            ],
        }
    })
}
export const updateUserRouter = createRoute({
    method: "put",
    path: "/api/v1/users/{id}",
    request: {
        params: OpenParamsSchema,
        body: {
            content: {
                "application/json": {
                    schema: openUserSchema.partial()
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openUserSchema
                }
            },
            description: "Update user"
        }
    }
});

export const deleteUserRouter = createRoute({
    method: "delete",
    path: "/api/v1/users/{id}",
    request: {
        params: OpenParamsSchema
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openMessageSchema
                }
            },
            description: "Delete user"
        }
    }
});