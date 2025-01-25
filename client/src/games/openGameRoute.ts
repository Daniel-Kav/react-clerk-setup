import { createRoute } from "@hono/zod-openapi";
import { openArrayResponseSchema, openGameSchema, OpenParamsSchema } from "../openApi/openApiSchemas";

export const allGamesOpenRouter = createRoute({
    method: "get",
    path: "/api/v1/games/",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openArrayResponseSchema(openGameSchema,200,"games"),
                },
            },
            description: "List of games",
        },
        // 400: {
        //     content: {
        //         "application/json": {
        //             schema: {
        //                 type: "object",
        //                 properties: {
        //                     message: {
        //                         type: "string",
        //                         example: "Unable to complete the request, please try again"
        //                     },
        //                     status: {
        //                         type: "number",
        //                         example: 400
        //                     }
        //                 }
        //             }
        //         },
        //     },
        //     description: "Bad request",
        // },
    }
})

export const getGameOpenRouter = createRoute({
    method: "get",
    path: "/api/v1/games/:id",
    request: {
        query: OpenParamsSchema
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: openGameSchema
                },
            },
            description: "Game found",
        },
        // 404: {
        //     content: {
        //         "application/json": {
        //             schema: {
        //                 type: "object",
        //                 properties: {
        //                     message: {
        //                         type: "string",
        //                         example: "Game not found"
        //                     },
        //                     status: {
        //                         type: "number",
        //                         example: 404
        //                     }
        //                 }
        //             }
        //         },
        //     },
        //     description: "Game not found",
        // },
        // 400: {
        //     content: {
        //         "application/json": {
        //             schema: {
        //                 type: "object",
        //                 properties: {
        //                     message: {
        //                         type: "string",
        //                         example: "Unable to complete the request, please try again"
        //                     },
        //                     status: {
        //                         type: "number",
        //                         example: 400
        //                     }
        //                 }
        //             }
        //         },
        //     },
        //     description: "Bad request",
        // },
    }
})

export const openCreateGameRouter = createRoute({
    method: "post",
    path: "/api/v1/games/",
    request: {
        body:{
            content: {
                "application/json": {
                    schema: openGameSchema
                },
            },
            description: "Game details"
        }
    },
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Game created successfully"
                            },
                            status: {
                                type: "number",
                                example: 201
                            }
                        }
                    }
                },
            },
            description: "Game created",
        },
        400: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Unable to complete the request, please try again"
                            },
                            status: {
                                type: "number",
                                example: 400
                            }
                        }
                    }
                },
            },
            description: "Bad request",
        },
    }
})

export const openDeleteGameRouter = createRoute({
    method: "delete",
    path: "/api/v1/games/:id",
    request: {
        query: OpenParamsSchema
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
                                example: "Game deleted successfully"
                            },
                            status: {
                                type: "number",
                                example: 200
                            }
                        }
                    }
                },
            },
            description: "Game deleted",
        },
        404: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Game not found"
                            },
                            status: {
                                type: "number",
                                example: 404
                            }
                        }
                    }
                },
            },
            description: "Game not found",
        },
        400: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Unable to complete the request, please try again"
                            },
                            status: {
                                type: "number",
                                example: 400
                            }
                        }
                    }
                },
            },
            description: "Bad request",
        },
    }
})

export const openUpdateGameRouter = createRoute({
    method: "put",
    path: "/api/v1/games/:id",
    request: {
        query: OpenParamsSchema,
        body:{
            content: {
                "application/json": {
                    schema: openGameSchema
                },
            },
            description: "Game details"
        }
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
                                example: "Game updated successfully"
                            },
                            status: {
                                type: "number",
                                example: 200
                            }
                        }
                    }
                },
            },
            description: "Game updated",
        },
        404: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Game not found"
                            },
                            status: {
                                type: "number",
                                example: 404
                            }
                        }
                    }
                },
            },
            description: "Game not found",
        },
        400: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Unable to complete the request, please try again"
                            },
                            status: {
                                type: "number",
                                example: 400
                            }
                        }
                    }
                },
            },
            description: "Bad request",
        },
    }
})
