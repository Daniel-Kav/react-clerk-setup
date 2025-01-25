import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { teamsSchema } from '../validators'
import { getAllTeamsController, getTeamController, createTeamController, updateTeamController, deleteTeamController } from './teams.controller'

export const teamRouter = new Hono()

teamRouter.get('/teams', getAllTeamsController)
teamRouter.get('/teams/:id', getTeamController)
teamRouter.post('/teams', zValidator('json', teamsSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createTeamController)
teamRouter.put('/teams/:id', updateTeamController)
teamRouter.delete('/teams/:id', deleteTeamController)
