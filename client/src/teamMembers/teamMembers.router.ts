import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { teamMembersSchema } from '../validators'
import { getAllTeamMembersController, getTeamMemberController, createTeamMemberController, updateTeamMemberController, deleteTeamMemberController } from './teamMembers.controller'

export const teamMemberRouter = new Hono()

teamMemberRouter.get('/teamMembers', getAllTeamMembersController)
teamMemberRouter.get('/teamMembers/:id', getTeamMemberController)
teamMemberRouter.post('/teamMembers', zValidator('json', teamMembersSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createTeamMemberController)
teamMemberRouter.put('/teamMembers/:id', updateTeamMemberController)
teamMemberRouter.delete('/teamMembers/:id', deleteTeamMemberController)
