import express from "express";
import { UserController } from "../controller/UserController";


export const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.getUsers)
userRouter.post("/follow", userController.followUser)
userRouter.delete("/unfollow", userController.unfollowUser)
userRouter.get("/feed", userController.getFeed)
userRouter.get("/friends", userController.getFriends)