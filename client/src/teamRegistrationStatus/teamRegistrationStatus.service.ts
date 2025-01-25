import { and, eq } from "drizzle-orm";
import { teamRegistrationStatus } from "../drizzle/schema";
import db from "../drizzle/db";
import { createTeamService } from "../teams/teams.services";


interface TeamRegistrationData {
    team_name: string;
    game_id: string;
    university_id: string;
    captain_id: string;
  }
  
  interface TeamMemberData {
    user_id: string;
    role_id?: string;
    is_captain?: boolean;
    is_vice_captain?: boolean;
  }

export const checkExistingRegistrationService = async (teamId: string, tournamentId: string): Promise<boolean> => {
    const existingRegistration = await db.query.teamRegistrationStatus.findFirst({
        where: and(
            eq(teamRegistrationStatus.team_id, teamId),
            eq(teamRegistrationStatus.tournament_id, tournamentId)
        )
    });

    return !!existingRegistration;
}
//a function to register the team for the tournament

export const registerTeamService = async (teamId: string, tournamentId: string): Promise<any> => {
    await db.insert(teamRegistrationStatus)
        .values({
            team_id: teamId,
            tournament_id: tournamentId,
            status: "PENDING",
            registration_date: new Date()
        })
    return true;
}

// export const registerTeamForTournament = async (
//     tournamentId: string,
//     registrationData: TeamRegistrationData,
//     members: TeamMemberData[]
//   ) => {
//     const { team_name, game_id, university_id, captain_id } = registrationData;
//     const [team] = await db.insert(teams).values({
//         team_name: registrationData.team_name,
//         game_id: tournament.game_id,
//         university_id: registrationData.university_id,
//         is_active: true
//       }).returning();
  
//     for (const member of members) {
//       await createTeamMemberService(teamId, member.user_id, member.role_id, member.is_captain, member.is_vice_captain);
//     }
  
//     await registerTeamService(teamId, tournamentId);
//   }
    
//a function to get the team registration status
export const getTeamRegistrationStatusService = async (teamId: string, tournamentId: string): Promise<any> => {
    return await db.query.teamRegistrationStatus.findFirst({
        where: and(
            eq(teamRegistrationStatus.team_id, teamId),
            eq(teamRegistrationStatus.tournament_id, tournamentId)
        )
    });
}

export const updateTeamRegistrationStatusService = async (
    teamId: string, 
    tournamentId: string, 
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    rejection_reason?: string
): Promise<any> => {
    await db.update(teamRegistrationStatus)
        .set({ 
            status,
            rejection_reason: status === 'REJECTED' ? rejection_reason : null,
            updated_at: new Date()
        })
        .where(
            and(
                eq(teamRegistrationStatus.team_id, teamId),
                eq(teamRegistrationStatus.tournament_id, tournamentId)
            )
        );
    return true;
}

export const getRegisteredTeamsService = async (tournamentId: string): Promise<any> => {
    return await db.query.teamRegistrationStatus.findMany({
        where: eq(teamRegistrationStatus.tournament_id, tournamentId)
    });
}

export const getTeamRegistrationStatusByTeamIdService = async (teamId: string): Promise<any> => {
    return await db.query.teamRegistrationStatus.findMany({
        where: eq(teamRegistrationStatus.team_id, teamId)
    });
}

export const getTeamRegistrationStatusByTournamentIdService = async (tournamentId: string): Promise<any> => {
    return await db.query.teamRegistrationStatus.findMany({
        where: eq(teamRegistrationStatus.tournament_id, tournamentId)
    });
}

export const getTeamRegistrationStatusByStatusService = async (status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<any> => {
    return await db.query.teamRegistrationStatus.findMany({
        where: eq(teamRegistrationStatus.status, status)
    });
}

