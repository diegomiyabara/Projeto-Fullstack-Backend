import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO, User} from "../model/User";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { InvalidParameterError } from "../error/InvalidParameterError";

export class UserController {
    private static userBusiness = new UserBusiness(
        new UserDatabase(),
        new IdGenerator(),
        new HashManager(),
        new Authenticator()
    );

    async signup(req: Request, res: Response) {
        try {

            const input: UserInputDTO = {
                name: req.body.name,
                email: req.body.email,
                nickname: req.body.nickname,
                password: req.body.password,
                role: req.body.role
            }

            const token = await UserController.userBusiness.createUser(input);

            res.status(200).send({ message: "User created sucessfully!", token });

        } catch (error) {
            res.status(error.code || 400).send({ message: error.message });
        }

        await BaseDatabase.destroyConnection();
    }

    async login(req: Request, res: Response) {
        try {
            const loginData: LoginInputDTO = {
                emailOrNickname: req.body.emailOrNickname as string,
                password: req.body.password as string
            };

            const token = await UserController.userBusiness.login(loginData);

            res.status(200).send({ message: "User logged sucessfully!", token });
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message });
        }

        await BaseDatabase.destroyConnection();
    }

    async getUsers(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string
            const hashtag = req.query.name as string

            const users = await UserController.userBusiness.getUsers(token, hashtag)

            res.status(200).send({Users: users})
        } catch (error) {
            res.status(error.code || 400).send({message: error.message})
        } finally {
            await BaseDatabase.destroyConnection()
        }
    }

    async followUser(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string
            const user_to_follow_id = req.body.user_to_follow_id as string

            const followed = await UserController.userBusiness.followUser(token, user_to_follow_id)

            res.status(200).send({message: `Você está seguindo agora ${followed.name}!`})
        } catch (error) {
            res.status(error.code || 400).send({message: error.message})
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    async unfollowUser(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string
            const user_to_unfollow_id = req.body.user_to_unfollow_id as string

            const followed = await UserController.userBusiness.unfollowUser(token, user_to_unfollow_id)

            res.status(200).send({message: `Você deixou de seguir ${followed.name}!`})
        } catch (error) {
            res.status(error.code || 400).send({message: error.message})
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    async getFriends(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string

            const friends = await UserController.userBusiness.getFriends(token)

            res.status(200).send({Friends: friends})
        } catch (error) {
            res.status(error.code || 400).send({message: error.message})
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    async getFeed(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string
            const hashtag = req.query.name as string
            const orderDate = req.query.orderBy as string
            
            const feed = await UserController.userBusiness.getFeed(token, hashtag, orderDate)

            res.status(200).send({Feed: feed})
        } catch (error) {
            res.status(error.code || 400).send({message: error.message})
        } finally {
            BaseDatabase.destroyConnection()
        }
    }
}