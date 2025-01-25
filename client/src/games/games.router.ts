import {getAllGamesController,getGameController,createGameController,deleteGameController,updateGameController, getActiveGamesController, getGameWithTournamentsController} from './games.controller'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { gamesSchema } from '../validators'
import { getRegtypeGamesController } from '../teams/teams.controller'

export const gameRouter = new Hono()

gameRouter.get('/games', getAllGamesController)
gameRouter.get('/games/:id', getGameController)
gameRouter.get('/games/:gameType', getRegtypeGamesController)
gameRouter.get('/games/active', getActiveGamesController);
gameRouter.get('/games/:id/tournaments', getGameWithTournamentsController);
gameRouter.post('/games', zValidator('json', gamesSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createGameController)
gameRouter.put('/games/:id', updateGameController)
gameRouter.delete('/games/:id', deleteGameController)
