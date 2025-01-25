import { Context } from "hono";
import { checkDuplicateTeamNameService, createTeamService, createTeamWithCaptainService, deleteTeamByIdService, getTeamByIdService, getTeamsService, updateTeamService } from "./teams.services";
import { getGameByRegTypeService, getGameRegTypeService } from "../games/games.services";
import { TSteams } from "../drizzle/schema";
import { HTTPException } from "hono/http-exception";

export const getAllTeamsController = async (c: Context) => {
    try {
        const teams = await getTeamsService();
        if (teams === undefined) {
            return c.json({ msg: "Teams not found", status: 404 }, 404);
        }
        return c.json({ teams: teams, status: 200 }, 200);

    } catch (error) {
        console.error("Error fetching teams:", error);
        return c.json({ msg: "Internal Server Error", status: 500 }, 500);
    }
}

export const getTeamController = async (c: Context) => {
    const id = c.req.param("id");

    try {
        const team = await getTeamByIdService(id);
        if (team === undefined) {
            return c.json({ msg: "Team not found", status: 404 }, 404);
        }
        return c.json({ team: team, status: 200 }, 200);

    }
    catch (error) {
        console.error("Error fetching team:", error);
        return c.json({ msg: "Internal Server Error", status: 500 }, 500);
    }
}

export const getRegtypeGamesController = async (c: Context) => {
    const gameType = c.req.param("gameType");
    if (gameType !== "OPEN" && gameType !== "CAPTAIN_ONLY") {
        return c.json({ msg: "Invalid game type", status: 400 }, 400);
    }
    try {
        const teams = gameType === "OPEN" ? await getGameByRegTypeService("OPEN")
            : await getGameByRegTypeService("CAPTAIN_ONLY");
        if (teams === undefined) {
            return c.json({ msg: "Teams not found", status: 404 }, 404);
        }
        return c.json({ teams: teams, status: 200 }, 200);

    } catch (error) {
        console.error("Error fetching teams:", error);
        return c.json({ msg: "Internal Server Error", status: 500 }, 500);
    }
}

export const createTeamController = async (c: Context) => {
    const teamData = await c.req.json();
    const userId = c.get('user').user_id;
    const userUniversity = c.get('user').university_id;

    try {

        const game = await getGameRegTypeService(teamData.game_id);
        if (!game) {
            throw new HTTPException(404, { message: 'Game not found' });
        }

        //check if team already exists
        const isDuplicate = await checkDuplicateTeamNameService(teamData.team_name, teamData.game_id);
        if (isDuplicate) {
            throw new HTTPException(409, {
                message: `Team name '${teamData.team_name}' already exists for this game`
            });
        }

        const newTeam = await createTeamWithCaptainService({
            team_name: teamData.team_name,
            game_id: teamData.game_id,
            university_id: userUniversity,
            captain_id: userId
        });

        return c.json({
            message: `${newTeam.team_name} created successfully`,
            status: 201
        }, 201);
    } catch (error: any) {
        return c.json({
            message: error.message || "Unable to create team",
            status: error.status || 400
        }, error.status || 400);
    }
};

export const deleteTeamController = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const team = await getTeamByIdService(id);
        if (!team) return c.json({ message: "Team not found", status: 404 }, 404);
        const deletedTeam = await deleteTeamByIdService(id);
        return c.json({ message: `${deletedTeam} deleted succesfuly`, status: 200 }, 200);
    } catch (e: any) {
        return c.json({
            message: "Unable to complete the request, please try again",
            status: 400
        }, 400);
    }
}

export const updateTeamController = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const team = await getTeamByIdService(id);

        if (!team) return c.json({ message: "Team not found", status: 404 }, 404);
        const teamData = await c.req.json();
        const updatedTeamName = await updateTeamService(id, teamData);
        return c.json(
            {
                message: `${updatedTeamName} updated successfully`,
                status: 200
            }, 200);

    } catch (e: any) {
        return c.json({
            message: "Unable to complete the request, please try again",
            status: 400
        }, 400);
    }
}

