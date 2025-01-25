import { Context } from "hono";
import { getAllController, getController, createController,deleteController,updateController } from "../generics/gen.controller";
import { getGamesService, getGameByIdService, createGameService, deleteGameByIdService, updateGameService, getActiveGamesService, getGameWithTournamentsService } from "./games.services";

type Game = {
    game_name: string;
    category: string;
    is_active: boolean;
    game_id: string;
}

type GameData = {
    game: Game;
    tournaments: any[];
}


export const getActiveGamesController = async (c: Context) => {
    try {
      const category = c.req.query('category') as "BATTLE_ROYALE" | "MULTIPLAYER" | "SPORTS_1V1" | "SPORTS_2V2" | "FIGHTING" | undefined;
      const games = await getActiveGamesService(category);
      
      if (!games.length) {
        return c.json({ 
          message: "No active games found",
          status: 404 
        }, 404);
      }
  
      return c.json({
        games,
        status: 200
      }, 200);
  
    } catch (error) {
      console.error("Error fetching active games:", error);
      return c.json({
        message: "Unable to fetch games",
        status: 500
      }, 500);
    }
  };
  
  export const getGameWithTournamentsController = async (c: Context) => {
    try {
      const gameId = c.req.param('id');
      const gameData = await getGameWithTournamentsService(gameId);
  
      return c.json({
        game: gameData.game,
        tournaments: gameData.tournaments,
        status: 200
      }, 200);
  
    } catch (error) {
      console.error("Error fetching game with tournaments:", error);
      return c.json({
        message: "Game not found or error fetching data",
        status: 404
      }, 404);
    }
  };


export const getAllGamesController = async (c: Context) => {
    try {
        const limit = c.req.query('limit');
        const games = await getGamesService(limit ? parseInt(limit) : undefined);
        return c.json({
            games,
            status: 200
        }, 200);
    } catch (e: any) {
        return c.json({ message: "Unable to complete the request, please try again",
            status: 400
         }, 400);
    }
}

export const getGameController = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const game = await getGameByIdService(id);
        if (!game) return c.json({ message: "Game not found", status: 404 }, 404);
        return c.json(game, 200);
    } catch (e: any) {
        return c.json({ message: "Unable to complete the request, please try again",
            status: 400
         }, 400);
    }
}

export const createGameController = async (c: Context) => {
    try {
        const game = await c.req.json();
        const newGame = await createGameService(game);
        return c.json({
            message: `${newGame.game_name} created successfully`,
            status: 201
        }, 201);
    } catch (e: any) {
        return c.json({ message: "Unable to complete the request, please try again",
            status: 400
         }, 400);
    }
}   

export const deleteGameController = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const game = await getGameByIdService(id);
        if (!game) return c.json({ message: "Game not found", status: 404 }, 404);
        const deletedGame = await deleteGameByIdService(id);
        return c.json({ message: `${deletedGame} deleted succesfuly`, status: 200 }, 200);
    } catch (e: any) {
        return c.json({ message: "Unable to complete the request, please try again",
            status: 400
         }, 400);
    }
}

export const updateGameController = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const game = await getGameByIdService(id);

        if (!game) return c.json({ message: "Game not found", status: 404 }, 404);
        const gameData = await c.req.json();
        const updatedGameName = await updateGameService(id, gameData);
        return c.json(
            {
                message: `${updatedGameName} updated successfully`,
                status: 200
            }, 200);
            
    } catch (e: any) {
        return c.json({ message: "Unable to complete the request, please try again",
            status: 400
         }, 400);
    }
}