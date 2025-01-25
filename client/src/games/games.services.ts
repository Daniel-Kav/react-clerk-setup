import { and, asc, desc, eq, or } from "drizzle-orm"
import db from "../drizzle/db"

import { games,TIgames,tournaments,TSgames, TStournaments } from "../drizzle/schema"
import { HTTPException } from "hono/http-exception";

export const getGamesService = async (limit?: number): Promise<TSgames[]> => {
    return await db.query.games.findMany({
        limit: limit
    });
}

export const getActiveGamesService = async (category?: 'BATTLE_ROYALE' | 'MULTIPLAYER' | 'SPORTS_1V1' | 'SPORTS_2V2' | 'FIGHTING'): Promise<TSgames[]> => {
    return await db.query.games.findMany({
      where: and(
        eq(games.is_active, true),
        category ? eq(games.category, category) : undefined
      ),
      orderBy: desc(games.created_at)
    });
  };
  
  export const getGameWithTournamentsService = async (gameId: string): Promise<{game: TSgames, tournaments: TStournaments[]}> => {
    const game = await db.query.games.findFirst({
      where: eq(games.game_id, gameId),
      with: {
        tournaments: {
          where: or(
            eq(tournaments.status, 'UPCOMING'),
            eq(tournaments.status, 'REGISTRATION_OPEN')
          ),
          orderBy: asc(tournaments.start_date)
        }
      }
    });
    //!remove this services should be clean
    if (!game) throw new HTTPException(404, { message: 'Game not found'});
    return { game, tournaments: game.tournaments };
  };

export const getGameByIdService = async (id: string) : Promise<TSgames | undefined> => {
    const game = await db.query.games.findFirst({
         where: eq(games.game_id, id)
    });
    return game || undefined;
}

export const getGameByRegTypeService = async (regType: 'CAPTAIN_ONLY' | 'OPEN') : Promise<TSgames | undefined> => {
    const game = await db.query.games.findFirst({
         where: eq(games.registration_type, regType)
    });
    return game;
}

export const createGameService = async (data: TIgames) :Promise<TIgames> => {
    
    const [newGame] = await db.insert(games).values(data).returning();
    return newGame;

}

export const deleteGameByIdService = async (id: string): Promise<string | undefined> => {
    const [gameName] = await db.delete(games).where(eq(games.game_id, id)).returning({game_name: games.game_name});
    
    return gameName.game_name;
}

export const updateGameService = async (id: string, data: TIgames): Promise<string | undefined> => {
    const [updatedGame] = await db.update(games).set(data).where(eq(games.game_id, id)).returning(
        {            
            game_name: games.game_name           
        }
    );
    return updatedGame.game_name ;
}

//get game registartion type
export const getGameRegTypeService = async (gameId: string): Promise<string | undefined> => {
    const game = await db.query.games.findFirst({
        where: eq(games.game_id, gameId),
        columns: { registration_type: true }
    });
    return game?.registration_type;
}