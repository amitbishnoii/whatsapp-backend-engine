import { createUser, getUser } from "../controllers/userController.js";
import express from "express";

const userRouter = express.Router();

userRouter.get("/users/:username", getUser);
userRouter.post("/users/create", createUser);

export default userRouter;