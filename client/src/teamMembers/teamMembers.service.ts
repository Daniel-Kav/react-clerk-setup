import { and, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { games, teamMembers, teams, TIteamMembers, TSteamMembers } from "../drizzle/schema";

export const getTeamMembersService = async (limit?: number): Promise<TSteamMembers[]> => {
    return limit
        ? await db.query.teamMembers.findMany({ limit })
        : await db.query.teamMembers.findMany();
}

export const getTeamMemberByIdService = async (id: string): Promise<TSteamMembers | undefined> => {
    return await db.query.teamMembers.findFirst({
        where: eq(teamMembers.team_id, id),
    })

}


export const createTeamMemberService = async (data: TIteamMembers): Promise<TIteamMembers> => {

    const [newTeamMember] = await db.insert(teamMembers).values(data).returning();
    return newTeamMember;

}

export const deleteTeamMemberByIdService = async (id: string): Promise<boolean> => {
    await db.delete(teamMembers).where(eq(teamMembers.team_id, id))
    return true;
}

export const updateTeamMemberService = async (id: string, data: TIteamMembers): Promise<TSteamMembers | undefined> => {
    await db.update(teamMembers).set(data).where(eq(teamMembers.team_id, id))
    const updatedTeamMember = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.team_id, id)
    });
    return updatedTeamMember || undefined;
}

export const checkTeamSizeService = async (teamId: string, gameId: string): Promise<boolean> => {
    const [currentMembers, game] = await Promise.all([
        db.query.teamMembers.findMany({
            where: eq(teamMembers.team_id, teamId),
            columns: { member_id: true }
        }),
        db.query.games.findFirst({
            where: eq(games.game_id, gameId),
            columns: { max_team_size: true }
        })
    ])
    return currentMembers.length < (game?.max_team_size ?? 0);
}

export const checkExistingMembershipService = async (userId: string, gameId: string): Promise<boolean> => {
    const existingMember = await db.query.teamMembers.findFirst({
        where: and(
            eq(teamMembers.user_id, userId),
            eq(teams.game_id, gameId)
        ),
        with: {
            team: {
                columns: { game_id: true }
            }
        }
    });

    return !!existingMember;
};

export const checkUserIsTeamCaptainService = async (teamId: string, userId: string): Promise<boolean> => {
    const teamMember = await db.query.teamMembers.findFirst({
        where: and(
            eq(teamMembers.team_id, teamId),
            eq(teamMembers.user_id, userId),
            eq(teamMembers.is_captain, true)
        )
    });

    return Boolean(teamMember);
};

