import { getAllController, getController, createController,deleteController,updateController } from "../generics/gen.controller";
import { createUserService, deleteUserByIdService, getUserByIdService, getUsersService, updateUserService } from "./users.services";


export const getAllUsersController = getAllController(getUsersService);
export const getUserController = getController(getUserByIdService);
export const createUserController = createController(createUserService);
export const deleteUserController = deleteController(getUserByIdService,deleteUserByIdService);
export const updateUserController = updateController(getUserByIdService,updateUserService);
