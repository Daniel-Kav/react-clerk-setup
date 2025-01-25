import {getAllUnisController,getUniController,createUniController,deleteUniController,updateUniController, getUniFromEmailController} from './uni.controller'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { emailSchema, universitiesSchema } from '../validators'

export const uniRouter = new Hono()

uniRouter.get('/universities', getAllUnisController)
uniRouter.get('/university/:id', getUniController)
uniRouter.post('/universities', zValidator('json', universitiesSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createUniController)
uniRouter.get('/university/email',zValidator('json',emailSchema, (result,c)=>{
    if(!result.success){
        return c.json(result.error,400)
    }
}), getUniFromEmailController);

uniRouter.put('/university/:id', updateUniController)
uniRouter.delete('/university/:id', deleteUniController)
