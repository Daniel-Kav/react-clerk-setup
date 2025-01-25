import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { verifyStudentSchema } from '../validators'
import { verifyStudentEmailController } from './verifyStudent.controller'

export const studentRouter = new Hono()

studentRouter.post('/verify-student', zValidator('json', verifyStudentSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), verifyStudentEmailController)