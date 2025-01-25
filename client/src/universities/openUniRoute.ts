import { createRoute} from "@hono/zod-openapi";
import { openArrayResponseSchema, OpenParamsSchema, openSingleResponseSchema, openUniversitySchema } from "../openApi/openApiSchemas";

export const getAllUnisRouter = createRoute({
    method: "get",
    path: "/api/v1/universities",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openArrayResponseSchema(openUniversitySchema, 200,"universities")
                }
            },
            description: "List all universities"
        }
    }
});

export const getAllUnisResponse = (c: any) => {
    return c.json({
        status: 200,
        data: [{
            university_id: '',
            university_name: '',
            university_logo_url: '',
            email_domain: '',
            has_whatsapp_group: false,
            whatsapp_group_link: '',
            whatsapp_no: 0,
            has_leader: false,
            location: '',
            region: ''
        }]
    })
}

export const unisResponse = (c: any) => {
    return c.json({
        status: 200,
        data: {
            university_id: '',
            university_name: '',
            university_logo_url: '',
            email_domain: '',
            has_whatsapp_group: false,
            whatsapp_group_link: '',
            whatsapp_no: 0,
            has_leader: false,
            location: '',
            region: ''
        }
    })
}

export const createUniRouter = createRoute({
    method: "post",
    path: "/api/v1/universities",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: openUniversitySchema
                }
            }
        }
    },
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: openSingleResponseSchema(openUniversitySchema, 201,"universities")
                }
            },
            description: "University created successfully"
        }
    }
});

export const getUniRouter = createRoute({
    method: "get",
    path: "/api/v1/universities/{id}",
    request: {
        params: OpenParamsSchema
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openSingleResponseSchema(openUniversitySchema, 200,"univerisities")
                }
            },
            description: "Get university by ID"
        }
    }
});

export const updateUniRouter = createRoute({
    method: "put",
    path: "/api/v1/universities/{id}",
    request: {
        params: OpenParamsSchema,
        body: {
            content: {
                "application/json": {
                    schema: openUniversitySchema.partial()
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openSingleResponseSchema(openUniversitySchema, 200,"universities")
                }
            },
            description: "University updated successfully"
        }
    }
});

export const deleteUniRouter = createRoute({
    method: "delete",
    path: "/api/v1/universities/{id}",
    request: {
        params: OpenParamsSchema
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
                                example: "University deleted"
                            }
                        }
                    }
                }
            },
            description: "University deleted"
        }
    }
});
