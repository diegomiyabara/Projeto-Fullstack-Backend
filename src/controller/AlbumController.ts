import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { AlbumBusiness } from "../business/AlbumBusiness";
import { AlbumDatabase } from "../data/AlbumDatabase";
import { AlbumInputDTO } from "../model/Album";

export class AlbumController {
    private static albumBusiness = new AlbumBusiness(
        new AlbumDatabase(),
        new IdGenerator(),
        new Authenticator()
    );

    async createAlbum(req: Request, res: Response) {
        try {
            const input: AlbumInputDTO = {
                name: req.body.name as string,
                description: req.body.description as string,
                albumImageUrl: req.body.albumImageUrl as string
            }

            const token = req.headers.authorization as string

            await AlbumController.albumBusiness.createAlbum(input, token)

            res.status(200).send({ message: `Album ${input.name} created sucessfully!` });
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message });
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    async getAllAlbuns (req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string
            const user_id = req.body.user_id as string

            const response = await AlbumController.albumBusiness.getAllAlbuns(token, user_id)

            res.status(200).send({Albuns: response})
        } catch (error) {
            res.status(error.code || 400).send({message: error.message})
        } finally {
            BaseDatabase.destroyConnection()
        }
    }
    
    async getAlbunsByUserId (req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string
            const hashtag = req.body.hashtag as string
            const orderDate = req.body.orderDate as string

            const response = await AlbumController.albumBusiness.getAlbunsByUserId(token, hashtag, orderDate)

            res.status(200).send({Albuns: response})
        } catch (error) {
            res.status(error.code || 400).send({message: error.message})
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    async getAlbumById(req: Request, res: Response) {
        try {
            const albumId = req.params.albumId as string
            const token = req.headers.authorization as string

            const response = await AlbumController.albumBusiness.getAlbumById(albumId, token)

            res.status(200).send({Album: response})
        } catch (error) {
            res.status(error.code || 400).send({message: error.message})
        } finally {
            BaseDatabase.destroyConnection()
        }
    }
}