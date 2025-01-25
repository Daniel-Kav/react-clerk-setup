import {getAllUsersController,getUserController,createUserController,deleteUserController,updateUserController} from './users.controller'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { usersSchema } from '../validators'

export const userRouter = new Hono()

userRouter.get('/users', getAllUsersController)
userRouter.get('/users/:id', getUserController)
userRouter.post('/users', zValidator('json', usersSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createUserController)
userRouter.put('/users/:id', updateUserController)
userRouter.delete('/users/:id', deleteUserController)
