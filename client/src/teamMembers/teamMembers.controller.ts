import { Context } from "hono";
import { getGameByRegTypeService } from "../games/games.services";
import { TSteamMembers } from "../drizzle/schema";
import { HTTPException } from "hono/http-exception";
import { getGameInfoFromTeamService } from "../teams/teams.services";
import { checkExistingMembershipService, checkTeamSizeService, createTeamMemberService, deleteTeamMemberByIdService, getTeamMemberByIdService, getTeamMembersService, updateTeamMemberService } from "./teamMembers.service";

export interface AddTeamMemberParams {
    team_id: string;
    user_id: string;
    role_id?: string;
    is_substitute?: boolean;
  }

export const getAllTeamMembersController = async (c:Context) => {
    try{
        const teamMembers = await getTeamMembersService();
        if (teamMembers === undefined) {
            return c.json({ msg: "TeamMembers not found", status: 404 }, 404);
        }
        return c.json({ teamMembers: teamMembers, status: 200 }, 200);

    } catch (error) {
        console.error("Error fetching teamMembers:", error);
        return c.json({ msg: "Internal Server Error", status: 500 }, 500);
    }
}

export const getTeamMemberController = async (c:Context) => {
    const id = c.req.param("id");
    
   try {
        const team = await getTeamMemberByIdService(id);
        if (team === undefined) {
            return c.json({ msg: "TeamMember not found", status: 404 }, 404);
        }
        return c.json({ team: team, status: 200 }, 200);

    }
    catch (error) {
        console.error("Error fetching team:", error);
        return c.json({ msg: "Internal Server Error", status: 500 }, 500);
    }
}


export const createTeamMemberController = async (c: Context) => {
    try {
       const teamData: AddTeamMemberParams = await c.req.json();

        const team = await getGameInfoFromTeamService(teamData.team_id);
        if (!team) {
            throw new HTTPException(404, { message: "Team not found"});
        }
        const hasSpace = await checkTeamSizeService(teamData.team_id,team.game_id);
        if (!hasSpace) {
            throw new HTTPException(400, { message: "Team is full"});
        }
        const existingMember = await checkExistingMembershipService(teamData.user_id, team.game_id);
        if (existingMember) {
            throw new HTTPException(400, { message: "User already a member of a team"});
        }
        await createTeamMemberService(teamData);

        return c.json({ message: "TeamMember  created successfully", status: 201 }, 201);

    } catch (e: any) {
        return c.json({ message: "Unable to complete the request, please try again",
            status: 400
         }, 400);
    }
}   

export const deleteTeamMemberController = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const team = await getTeamMemberByIdService(id);
        if (!team) return c.json({ message: "TeamMember not found", status: 404 }, 404);
        const deletedTeamMember = await deleteTeamMemberByIdService(id);
        return c.json({ message: `${deletedTeamMember} deleted succesfuly`, status: 200 }, 200);
    } catch (e: any) {
        return c.json({ message: "Unable to complete the request, please try again",
            status: 400
         }, 400);
    }
}

export const updateTeamMemberController = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const team = await getTeamMemberByIdService(id);

        if (!team) return c.json({ message: "TeamMember not found", status: 404 }, 404);
        const teamData = await c.req.json();
        const updatedTeamMemberName = await updateTeamMemberService(id, teamData);
        return c.json(
            {
                message: `${updatedTeamMemberName} updated successfully`,
                status: 200
            }, 200);
            
    } catch (e: any) {
        return c.json({ message: "Unable to complete the request, please try again",
            status: 400
         }, 400);
    }
}

