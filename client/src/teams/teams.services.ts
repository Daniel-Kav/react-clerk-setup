import { and, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { teams, TIteams, TSteams } from "../drizzle/schema";
import { createTeamMemberService } from "../teamMembers/teamMembers.service";


type GameInfo = {
    game_id: string;
  }

    interface CreateTeamParams {
        team_name: string;
        game_id: string;
        university_id: string;
        captain_id: string;
    }


export const getTeamsService = async (limit?:number): Promise<TSteams[]> => {
    return limit 
    ? await db.query.teams.findMany({ limit })
    : await db.query.teams.findMany();
}

export const getTeamByIdService = async (id: string): Promise<TSteams | undefined> => {
    return await db.query.teams.findFirst({
      where: eq(teams.team_id, id),
    })
  
  }

 
export const getGameInfoFromTeamService = async (id: string): Promise<GameInfo | undefined> => {
    return await db.query.teams.findFirst({
        where: eq(teams.team_id, id),
        columns: {
            game_id: true
        }
    })
}

export const createTeamService = async (data: TIteams) :Promise<TIteams> => {
    
    const [newTeam] = await db.insert(teams).values(data).returning();
    return newTeam;

}
export const createTeamWithCaptainService = async (data: CreateTeamParams): Promise<TIteams> => {
   
    // Create team
    const [team] = await db.insert(teams).values({
      team_name: data.team_name,
      game_id: data.game_id,
      university_id: data.university_id,
      is_active: true
    }).returning();
  
    
    await createTeamMemberService({
        team_id: team.team_id,
        user_id: data.captain_id,
        is_captain: true,
        joined_at: new Date(),
        created_at: new Date(),
        status: 'ACTIVE'
      })
    
    return team;                
  };

export const deleteTeamByIdService = async (id: string): Promise<boolean> => {
    await db.delete(teams).where(eq(teams.team_id, id))
    return true;
}

export const updateTeamService = async (id: string, data: TIteams): Promise<TSteams | undefined> => {
    await db.update(teams).set(data).where(eq(teams.team_id, id)) 
    const updatedTeam = await db.query.teams.findFirst({
        where: eq(teams.team_id, id)
    });
    return updatedTeam || undefined;
}

export const checkDuplicateTeamNameService = async (teamName: string,gameId:string): Promise<boolean> => {
    const team = await db.query.teams.findFirst({
        where: and(
            eq(teams.team_name, teamName),
            eq(teams.game_id, gameId)
        )
    });
    return !!team;
}
