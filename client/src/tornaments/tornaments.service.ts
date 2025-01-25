import { and, desc, eq, gt } from "drizzle-orm";
import { teams, TIgames, tournaments, TStournaments } from "../drizzle/schema";
import db from "../drizzle/db";
import { HTTPException } from "hono/http-exception";

export const getActiveTournamentsService = async (): Promise<TStournaments[]> => {
    return await db.query.tournaments.findMany({
        where: and(
            gt(tournaments.registration_deadline, new Date().toISOString()),
            eq(tournaments.status, 'ACTIVE')
        ),
        orderBy: desc(tournaments.start_date)
    });
};


export const getTournamentWithGameTypeService = async (tournamentId: string): Promise<TStournaments & { game: TIgames }> => {
  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.tournament_id, tournamentId),
    with: {
      game: true
    }
  });

  if (!tournament) throw new HTTPException(404, { message: 'Tournament not found' });

  // 2. Check if registration is still open
  if (tournament.status !== 'REGISTRATION_OPEN') {
    throw new HTTPException(400, { message: 'Tournament registration is not open' });
  }
  return tournament;

};
export const getTournamentByIdService = async (id: string): Promise<TStournaments | undefined> => {
    return await db.query.tournaments.findFirst({
        where: eq(tournaments.tournament_id, id),
    });
};

export const checkRegistrationDeadlineService = async (tournamentId: string): Promise<boolean> => {
    const tournament = await db.query.tournaments.findFirst({
        where: eq(tournaments.tournament_id, tournamentId),
        columns: { registration_deadline: true }
    });

    return tournament ? new Date() < new Date(tournament.registration_deadline) : false;
};



export const validateTeamGameMatchService = async (teamId: string, tournamentId: string): Promise<boolean> => {
    const [team, tournament] = await Promise.all([
      db.query.teams.findFirst({
        where: eq(teams.team_id, teamId),
        columns: { game_id: true }
      }),
      db.query.tournaments.findFirst({
        where: eq(tournaments.tournament_id, tournamentId),
        columns: { game_id: true }
      })
    ]);
  
    if (!team || !tournament) {
      throw new HTTPException(404, { message: 'Team or tournament not found' });
    }
  
    return team.game_id === tournament.game_id;
  };