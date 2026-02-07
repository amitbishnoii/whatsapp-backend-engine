import { addFriend, createUser, getUser } from "../controllers/userController.js";
import express from "express";

const userRouter = express.Router();

userRouter.get("/users/:username", getUser);
userRouter.post("/users/create", createUser);
userRouter.post("/users/addFriend", addFriend);

export default userRouter;