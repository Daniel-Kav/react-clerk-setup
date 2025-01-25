import { OpenAPIHono } from '@hono/zod-openapi'
import { googleOAuthCallbackResponce, googleOAuthCallbackRouter, registerNewUserResponce, registerNewUserRouter, resendVerificationResponce, resendVerificationRouter, resetPasswordRouter, signInUserResponce, signInUserRouter, verifyEmailResponce, verifyEmailRouter } from '../auth/openAuthRoute'
import { deleteUserRouter, getAllUsersResponse, getAllUsersRouter, getUserResponse, getUserRouter, updateUserRouter } from '../users/openUsersRoute'
import { createUniRouter, deleteUniRouter, getAllUnisResponse, getAllUnisRouter, getUniRouter, unisResponse, updateUniRouter } from '../universities/openUniRoute'
import { allGamesOpenRouter, getGameOpenRouter } from '../games/openGameRoute'
// import { allGamesOpenRoute, getGameOpenRoute, openDeleteGameRoute } from '../games/openGameRoute'


const OpenApi = new OpenAPIHono()

OpenApi.doc('/doc', {
    openapi: '3.1.0',
    info: {
        title: 'KUER API Documentation',
        version: '1.0.0',
        description: 'API documentation using Swagger UI',
        contact: {
            name: 'API Support',
            email: 'support@yourdomain.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:5000/api/v1',
            description: 'Development server'
        },
        {
            url: 'https://kuerback.azurewebsites.net/api/v1',
            description: 'Production server'
        }
    ],

})

OpenApi.openapi(registerNewUserRouter, registerNewUserResponce)
OpenApi.openapi(signInUserRouter, signInUserResponce)
OpenApi.openapi(googleOAuthCallbackRouter, googleOAuthCallbackResponce)
OpenApi.openapi(verifyEmailRouter, verifyEmailResponce)
OpenApi.openapi(resendVerificationRouter, resendVerificationResponce)
OpenApi.openapi(resetPasswordRouter, resendVerificationResponce)

OpenApi.openapi(getAllUsersRouter, getAllUsersResponse)
OpenApi.openapi(getUserRouter, getUserResponse)
OpenApi.openapi(updateUserRouter, (c:any) => c.json({ user: {} }))
OpenApi.openapi(deleteUserRouter, (c) => c.json({ message: "User deleted" }))

OpenApi.openapi(getAllUnisRouter, getAllUnisResponse)
OpenApi.openapi(getUniRouter, unisResponse)
OpenApi.openapi(createUniRouter, (c:any) => c.json({
    status: 201,
    message: "University created"
}))
OpenApi.openapi(updateUniRouter, unisResponse)
OpenApi.openapi(deleteUniRouter, (c: any) => c.json({
    status: 200,
    data: { message: "University deleted" }
}))

// //games
// // OpenApi.openapi(allGamesOpenRouter, (c: any) => c.json({ status: 200, games: [] }))
// OpenApi.openapi(getGameOpenRouter, (c: any) => c.json({ status: 200, games: {} }))
// // OpenApi.openapi(openUpdateGameRoute, (c: any) => c.json({}))
// // OpenApi.openapi(openUpdateGameRoute, (c: any) => c.json({status: 200,message: "Game updated" }))
// // OpenApi.openapi(openDeleteGameRoute, (c: any) => c.json({
// //     status: 200, data: { message: "Game deleted" }
// // }))



OpenApi.onError((err, c) => {
    console.error(`OpenAPI Error: ${err}`);
    return c.json({ error: 'Internal Server Error' }, 500);
})

export default OpenApi
