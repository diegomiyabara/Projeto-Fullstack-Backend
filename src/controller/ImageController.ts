import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { ImageBusiness } from "../business/ImageBusiness";
import { ImageDatabase } from "../data/ImageDatabase";
import { ImageInputDTO } from "../model/Image";

export class ImageController {
    private static imageBusiness = new ImageBusiness(
        new ImageDatabase(),
        new IdGenerator(),
        new Authenticator()
    );

    async addImage(req: Request, res: Response) {
        try {
            const input: ImageInputDTO = {
                description: req.body.description as string,
                photoUrl: req.body.photoUrl as string,
                album_id: req.body.album_id as string
            }

            const token = req.headers.authorization as string

            const response = await ImageController.imageBusiness.addImage(input, token)

            res.status(200).send({ message: `Image added to album ${response.name} sucessfully!` });
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message });
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    async getAlbumImages(req: Request, res: Response) {
        try {
            const album_id = req.query.albumId as string
            const token = req.headers.authorization as string

            const response = await ImageController.imageBusiness.getAlbumImages(album_id, token)

            res.status(200).send({Images: response})
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message });
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    async getImageById(req: Request, res: Response) {
        try {
            const id = req.params.id as string
            const token = req.headers.authorization as string

            const response = await ImageController.imageBusiness.getImageById(id, token)

            res.status(200).send(response)
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message });
        } finally {
            BaseDatabase.destroyConnection()
        }
    }
}