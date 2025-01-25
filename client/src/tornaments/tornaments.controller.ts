import { Context } from "hono";
import { checkRegistrationDeadlineService, getTournamentByIdService, getTournamentWithGameTypeService, validateTeamGameMatchService } from "./tornaments.service";
import { HTTPException } from "hono/http-exception";
import { checkExistingRegistrationService, registerTeamService } from "../teamRegistrationStatus/teamRegistrationStatus.service";
import { checkUserIsTeamCaptainService } from "../teamMembers/teamMembers.service";


type TeamRegistration = {
    teamId: string;
    tournamentId: string;
}
interface Member {
    user_id: string;
    is_captain: boolean;
}

interface GameType {
    registration_type: 'CAPTAIN_ONLY' | string;
}

interface Tournament {
    game: GameType;
}


export const registerTeamForTournamentController = async (c: Context) => {
    const registration: TeamRegistration = await c.req.json();
    const userId = c.get('user').user_id; // From auth middleware

    try {
        const tournament = await getTournamentWithGameTypeService(registration.tournamentId);
        if (!tournament) {
            return c.json({ msg: "Tournament not found", status: 404 }, 404);
        }
        if (tournament.game.registration_type === 'CAPTAIN_ONLY') {
            const isCaptain = await checkUserIsTeamCaptainService(registration.teamId, userId);
            if (!isCaptain) {
                throw new HTTPException(403, { message: 'Only team captains can register' });
            }
        }
       
        const isOpen = await checkRegistrationDeadlineService(registration.tournamentId);
        if (!isOpen) {
            return c.json({ msg: "Registration deadline has passed", status: 400 }, 400);
        }
        const existingTeam = await checkExistingRegistrationService(registration.teamId, registration.tournamentId);
        if (existingTeam) {
            return c.json({ msg: "Team already registered for the tournament", status: 400 }, 400);
        }
        const isGameMatch = await validateTeamGameMatchService(registration.teamId, registration.tournamentId);
        if (!isGameMatch) {
            throw new HTTPException(400, {
                message: "Team's game does not match tournament game"
            });
        }

        try {
            await registerTeamService(registration.teamId, registration.tournamentId);
            return c.json({ msg: "Team registered successfully", status: 200 }, 200);
        } catch (error: any) {
            return c.json({ msg: error.message, status: 400 }, 400);
        }
    } catch (error:any) {
        console.error("Error registering registration for tournament:", error);
        return c.json({
            message: error.message || 'Registration failed',
            status: error.status || 500
          }, error.status || 500)
    }

}