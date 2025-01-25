"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const hono_1 = require("hono");
const user_controller_1 = require("./user.controller");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
exports.userRouter = new hono_1.Hono();
//get all users      api/users
exports.userRouter.get("/users", user_controller_1.listUsers);
//get a single user    api/users/1
exports.userRouter.get("/users/:id", user_controller_1.getUser);
// create a user 
exports.userRouter.post("/users", (0, zod_validator_1.zValidator)('json', validators_1.userSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), user_controller_1.createUser);
//update a user
exports.userRouter.put("/users/:id", user_controller_1.updateUser);
exports.userRouter.delete("/users/:id", user_controller_1.deleteUser);
//https:domai.com/api/users?limit=10
